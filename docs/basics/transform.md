# Transform

Every GameObject in Unity has a `Transform` component. It stores the object’s position, rotation, and scale, but also defines parent-child hierarchies. Mastering transform math is essential for placing objects, moving characters, and aligning UI.

## Position

- `transform.position` – world-space coordinates.
- `transform.localPosition` – position relative to the parent transform.
- `transform.Translate(...)` – moves the transform by a vector, optionally in local or world space.

```csharp
// Move 2 units forward in the object's local space.
transform.Translate(Vector3.forward * 2f);

// Position: Vector3 representing world space coordinates (x, y, z).
transform.position = new Vector3(0f, 2f, 0f);

// Position relative to parent transform.
transform.localPosition = Vector3.zero;

// Convert from local to world coordinates with TransformPoint.
Vector3 worldSlot = transform.TransformPoint(new Vector3(0f, 1f, 0f));
```

Use `TransformPoint` / `InverseTransformPoint` when working with offsets relative to parents or sockets (e.g., weapon attachments).

## Rotation

Unity exposes rotations as both Euler angles (degrees) and quaternions. Prefer quaternions when interpolating or composing rotations to avoid gimbal lock.

- `transform.rotation` – world-space quaternion.
- `transform.localRotation` – rotation relative to parent.
- `transform.eulerAngles` – short-term access to world Euler angles; changing it recalculates the quaternion.
- `transform.LookAt(target)` – convenience to orient forward vector toward a point.

```csharp
// Rotate 90 degrees around Y in world space.
transform.rotation = Quaternion.Euler(0f, 90f, 0f);

// Smoothly rotate toward target.
Quaternion targetRotation = Quaternion.LookRotation(target.position - transform.position);
transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * turnSpeed);

// Rotate 45 degrees per second around local X.
transform.Rotate(Vector3.right * 45f * Time.deltaTime, Space.Self);
```

## Scale

- `transform.localScale` – scale relative to parent; default `(1,1,1)`.
- Avoid negative or zero scale on gameplay objects; it can flip normals and break physics.
- When animating scale or using child hierarchies, consider normalizing parent scale to `(1,1,1)` and applying adjustments on children.

```csharp
// Double the size uniformly.
transform.localScale = Vector3.one * 2f;

// Pulse scale over time.
float pulse = 1f + Mathf.Sin(Time.time) * 0.2f;
transform.localScale = new Vector3(pulse, pulse, pulse);
```

## Hierarchies & Parenting

- `transform.SetParent(newParent, worldPositionStays)` – reparent while optionally preserving world transform.
- Access children via `transform.GetChild(index)` or iterate with `foreach (Transform child in transform)`.
- Be careful when scaling parents; child transforms inherit scale/rotation.

```csharp
// Attach pickup to hand but keep current world position.
pickupTransform.SetParent(handTransform, worldPositionStays: true);

// Detach from parent and reset local transform.
transform.SetParent(null);
transform.localPosition = Vector3.zero;
transform.localRotation = Quaternion.identity;
transform.localScale = Vector3.one;
```

## Space Conversions

- `TransformDirection` – convert local direction vector to world space without affecting magnitude.
- `InverseTransformDirection` – world → local direction.
- `TransformVector` / `InverseTransformVector` – similar but include scale.

```csharp
// Cast a ray straight ahead in world space using local forward.
Vector3 worldForward = transform.TransformDirection(Vector3.forward);
Physics.Raycast(transform.position, worldForward, out var hit, 10f);

// Align UI element to camera-forward projected on the horizontal plane.
Vector3 cameraForward = cameraTransform.forward;
Vector3 planarForward = Vector3.ProjectOnPlane(cameraForward, Vector3.up).normalized;
transform.rotation = Quaternion.LookRotation(planarForward);
```

## Inspecting Transforms in the Editor

- Toggle **local/global gizmo** (hotkey `X` in newer Unity versions or the toolbar icon) to move in either coordinate space.
- Use the **Pivot/Center** toggle to adjust the gizmo pivot when multiple objects are selected.
- For precision, type numeric values directly into the inspector. Reset to defaults via the gear icon > `Reset`.

## Best Practices

- Keep your root GameObject scale at `(1,1,1)` and apply visual scaling to child meshes.
- Avoid setting `transform.parent` directly; prefer `SetParent` with `worldPositionStays` to control how transforms change.
- Cache `transform` in hot loops? Not needed—Unity already caches it internally, but store other component references (`transform.parent`, child lookups) if accessed frequently.
- When driving objects with physics, modify the `Rigidbody` using `MovePosition` / `MoveRotation` instead of changing the transform directly.

Mastering transforms unlocks accurate positioning, smooth rotations, and clean hierarchies across your project. Combine these tools with math helpers (`Vector3`, `Quaternion`) to build precise gameplay behaviour.
