# Quaternion

Quaternions represent 3D rotations without the gimbal lock issues of Euler angles. Unity stores every `Transform` rotation as a quaternion, so understanding the common factory methods and helpers lets you aim objects, blend motion, and compose complex orientations safely.

## When to Reach for Quaternions

- Combine multiple rotations without accumulating numerical drift.
- Smoothly turn characters, cameras, and projectiles toward targets.
- Blend animation poses or camera rigs while keeping motion on the shortest arc.
- Rotate vectors (e.g., forward, up) into new orientations without touching Euler angles.

## Creating Rotations

```csharp
// Identity (no rotation)
Quaternion idle = Quaternion.identity;

// From Euler angles in degrees (yaw, pitch, roll)
Quaternion yaw30 = Quaternion.Euler(0f, 30f, 0f);

// Axis-angle: rotate 45 degrees around an arbitrary axis
Quaternion tilt = Quaternion.AngleAxis(45f, new Vector3(1f, 0f, 1f).normalized);

// Aim the forward vector toward a direction (optionally supply the up axis)
Vector3 targetDirection = enemy.position - transform.position;
Quaternion aim = Quaternion.LookRotation(targetDirection, Vector3.up);
```

`Quaternion.Euler` expects degrees, matching the Unity inspector. Use axis-angle or `LookRotation` when you already have meaningful directions in world/local space.

## Composing and Applying Rotations

```csharp
// Order matters: result applies "tilt" first, then "turn"
Quaternion turn = Quaternion.Euler(0f, 90f, 0f);
Quaternion composed = turn * tilt;

// Apply an incremental spin each frame
transform.rotation = transform.rotation * Quaternion.Euler(0f, spinSpeed * Time.deltaTime, 0f);

// Rotate a direction vector by a quaternion
Vector3 worldForward = composed * Vector3.forward;
```

Quaternion multiplication is not commutative; swapping operands changes the order the rotations are applied.

## Interpolating and Limiting

```csharp
// Smoothly turn toward a target rotation over time
Quaternion desired = Quaternion.LookRotation(targetDirection);
transform.rotation = Quaternion.Slerp(transform.rotation, desired, turnSpeed * Time.deltaTime);

// Clamp rotation speed in degrees per second
transform.rotation = Quaternion.RotateTowards(transform.rotation, desired, maxDegreesPerSecond * Time.deltaTime);

// Shortest angle between two orientations
double delta = Quaternion.Angle(transform.rotation, desired);
```

Use `Slerp` for consistent angular velocity, `Lerp` for cheaper but non-constant motion, and `RotateTowards` to enforce hard turn-rate caps.

## Inspecting and Converting

```csharp
// Read or assign world Euler angles (Unity converts under the hood)
Vector3 asEuler = transform.rotation.eulerAngles;
transform.eulerAngles = new Vector3(0f, 180f, 0f);

// Extract axis-angle representation
transform.rotation.ToAngleAxis(out float angle, out Vector3 axis);

// Invert or normalize to clean up drift
Quaternion inverse = Quaternion.Inverse(transform.rotation);
Quaternion normalized = Quaternion.Normalize(transform.rotation);
```

Remember that the underlying quaternion values (`x`, `y`, `z`, `w`) are rarely edited directly—convert to a representation that matches the task, make the change, then convert back.

## Best Practices & Debugging

- Keep quaternions normalized; repeated floating-point operations can introduce drift. Re-normalize occasionally when composing many rotations.
- Prefer quaternion math when blending or accumulating rotations; only fall back to Euler angles for UI and inspector-friendly tweaks.
- Visualize directions with `Debug.DrawRay(transform.position, transform.rotation * Vector3.forward);`.
- When debugging in the inspector, right-click the rotation label and choose **Copy** to grab Euler values or **Reset** to `Quaternion.identity`.
- Cache reusable orientations (e.g., `Quaternion.LookRotation(Vector3.forward)`) rather than recalculating every frame in hot paths.

Learning the core factory methods and helpers makes quaternions approachable—lean on them instead of writing custom math, and you’ll avoid the pitfalls that Euler-based workflows encounter.
