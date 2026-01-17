# Unity Euler Angles - Rotation in Degrees

Euler angles describe rotations with three ordered rotations (typically yaw, pitch, roll) expressed in degrees. Unity exposes them heavily in the Inspector, but under the hood it converts every change to quaternions. Treat Euler angles as a user-friendly façade: lean on them for authoring and quick edits, then hand off to quaternions for math-heavy work.

## Where Euler Angles Shine

- Editing rotations in the Inspector or scripting quick adjustments in degrees.
- Presenting player-facing data such as compass bearings or camera pitch.
- Constraining motion to specific axes (e.g., yaw-only turrets, clamped camera pitch).
- Debug logging of orientation values without converting radians to degrees.

## Reading and Setting Euler Values

```csharp
// Grab the world rotation in degrees
Vector3 worldEuler = transform.eulerAngles; // e.g., (0, 180, 0)

// Override the yaw while keeping existing pitch/roll
Vector3 newEuler = worldEuler;
newEuler.y = desiredHeadingDegrees;
transform.eulerAngles = newEuler;

// Local rotation in degrees, relative to the parent
Vector3 localEuler = transform.localEulerAngles;
transform.localEulerAngles = new Vector3(0f, 45f, 0f);
```

Euler angles wrap to the range `[0, 360)` when read from Unity. If you need values centered around zero, normalize them manually with helpers like `Mathf.DeltaAngle`.

## Creating Quaternions From Euler Data

```csharp
// Construct from components (XYZ order, degrees)
Quaternion facing = Quaternion.Euler(0f, 30f, 0f);

// Construct from a vector
Vector3 turretAngles = new Vector3(0f, 90f, 0f);
Quaternion turretRotation = Quaternion.Euler(turretAngles);

// Mix: set pitch in Euler, keep yaw from a quaternion
Quaternion baseRotation = transform.rotation;
Vector3 mixedEuler = baseRotation.eulerAngles;
mixedEuler.x = pitchDegrees;
transform.rotation = Quaternion.Euler(mixedEuler);
```

Under the hood Unity uses Z-X-Y (roll, pitch, yaw) order when converting Euler angles to quaternions. You usually do not need to care, but remember that reordering axes changes the final orientation.

## Avoiding the Common Pitfalls

- **Gimbal lock** – When two axes align, you lose a degree of freedom. This happens when composing Euler rotations directly; generate a quaternion via `Quaternion.Euler` and combine in quaternion space instead.
- **Interpolation artefacts** – `Vector3.Lerp` on Euler angles causes axis flipping near 180/360°. Prefer `Quaternion.Slerp` or `Quaternion.Lerp` for smooth motion.
- **Angle wrapping** – Values jump between `0` and `360` instead of smoothly crossing through zero. Use `Mathf.DeltaAngle`, or track your own unbounded angle accumulator.
- **Inspector edit order** – Rotations apply in Z-X-Y order. Animating multiple axes simultaneously can produce unintuitive curves; preview in the animation window to verify.

## Debugging & Utilities

```csharp
// Convert quaternion to Euler for logging
Vector3 display = transform.rotation.eulerAngles;
Debug.Log($"Heading: {display.y:0}° Pitch: {display.x:0}°");

// Clamp pitch while keeping yaw free
Vector3 clamped = transform.localEulerAngles;
clamped.x = Mathf.Clamp(Mathf.DeltaAngle(0f, clamped.x), -45f, 45f);
clamped.x = (clamped.x + 360f) % 360f; // convert back to 0-360 range
transform.localEulerAngles = clamped;

// Build a quaternion after editing Euler values
Vector3 offsetEuler = new Vector3(0f, 45f, 0f);
Quaternion offsetRotation = Quaternion.Euler(offsetEuler) * transform.rotation;
```

Use Euler angles where readability and simple axis locks matter, but switch to quaternions for compound rotations, interpolation, and physics-facing logic. Combining both viewpoints lets you keep authoring intuitive while the runtime math stays robust.
