# Unity Vector3 - 3D Vectors and Operations

`Vector3` represents 3D positions and directions. Unity relies on it for coordinates, velocities, normals, and almost every spatial calculation. Master the helpers and operators so you can manipulate vectors quickly without reinventing common math.

## Creating Vectors

```csharp
// Individual components (x, y, z)
Vector3 origin = new Vector3(0f, 0f, 0f);
Vector3 position = new Vector3(2.5f, 1f, -4f);

// Convenience constructors
Vector3 zeros = Vector3.zero;
Vector3 ones = Vector3.one;
Vector3 unitX = Vector3.right;   // (1, 0, 0)
Vector3 unitY = Vector3.up;      // (0, 1, 0)
Vector3 unitZ = Vector3.forward; // (0, 0, 1)
```

Unity treats forward as positive Z in local space and up as positive Y. These direction constants are normalized; scale them to get distances.

## Basic Math Operations

```csharp
Vector3 a = new Vector3(1f, 2f, 3f);
Vector3 b = new Vector3(-2f, 0f, 5f);

Vector3 sum        = a + b;                // add component-wise
Vector3 difference = a - b;                // subtract component-wise
Vector3 scaled     = a * 2f;               // scale by a scalar
Vector3 hadamard   = Vector3.Scale(a, b);  // scale per component
```

These operators cover most day-to-day math: add/subtract to combine offsets, multiply by scalars to grow/shrink vectors, and use `Vector3.Scale` when you need non-uniform scaling.

### Dot Product (alignment and angles)

The dot product (dot multiplication) returns a scalar describing how aligned two vectors are: `1` means pointing the same way, `0` means perpendicular, and `-1` means opposite.

```csharp
Vector3 toTargetDir = (target.position - transform.position).normalized;
float alignment = Vector3.Dot(transform.forward, toTargetDir);
bool facingTarget = alignment > 0.5f; // tweak threshold to taste
```

You can turn that scalar into an angle when needed: `float angle = Mathf.Acos(Mathf.Clamp(alignment, -1f, 1f)) * Mathf.Rad2Deg;`.

### Cross Product (build a surface basis)

The cross product outputs a vector perpendicular to the two inputs. It is perfect for building local axes such as tangents and binormals from a known surface normal.

```csharp
Vector3 surfaceNormal = hit.normal.normalized;
Vector3 referenceUp = Mathf.Abs(Vector3.Dot(surfaceNormal, Vector3.up)) > 0.99f ? Vector3.right : Vector3.up;
Vector3 tangent = Vector3.Cross(referenceUp, surfaceNormal).normalized;   // lies on the surface
Vector3 binormal = Vector3.Cross(surfaceNormal, tangent);                 // perpendicular to both normal and tangent
```

`surfaceNormal` points straight out from the surface, `tangent` runs along the surface (great for sliding or UVs), and `binormal` completes the orthogonal trio. Together they describe the local surface orientation.

## Magnitude and Normalization

```csharp
Vector3 velocity = rigidbody.velocity;
float speed = velocity.magnitude;        // length
float sqrSpeed = velocity.sqrMagnitude;  // cheaper length^2

Vector3 direction = velocity.normalized; // zero-safe normalized copy
Vector3 unit = Vector3.Normalize(velocity); // static variant
```

Use `sqrMagnitude` to avoid square roots when comparing distances. Normalize before projecting or rotating to maintain unit-length directions.

## Movement & Interpolation Helpers

```csharp
// Move toward a goal at constant speed
transform.position = Vector3.MoveTowards(transform.position, targetPos, moveSpeed * Time.deltaTime);

// Interpolate with easing control
Vector3 mid = Vector3.Lerp(startPos, endPos, t);
Vector3 smooth = Vector3.Slerp(startDir, endDir, t); // spherical interpolation for directions

// Clamp how far an input vector can reach
Vector3 input = new Vector3(h, 0f, v);
Vector3 limited = Vector3.ClampMagnitude(input, 1f);
```

`Lerp` works for positions and scaled directions; prefer `Slerp` when keeping constant angular velocity between two unit vectors.

## Projection, Reflection, and Planar Work

```csharp
// Project onto a plane (e.g., remove vertical component)
Vector3 planar = Vector3.ProjectOnPlane(transform.forward, Vector3.up);

// Reflect incoming direction around a surface normal
Vector3 bounceDir = Vector3.Reflect(incomingDir, hitNormal);

// Align camera forward to the horizontal plane
Vector3 flatForward = new Vector3(camera.forward.x, 0f, camera.forward.z).normalized;
```

Projection and reflection are staples for physics responses, sliding, and camera alignment.

## Debugging & Best Practices

- Store frequently used directions (`Vector3.up`, `Vector3.forward`) to avoid repeated property calls in tight loops.
- Prefer `Vector3.Distance` or `Vector3.SqrMagnitude` for distance checks rather than manually subtracting and measuring.
- Visualize vectors with `Debug.DrawLine` or `Debug.DrawRay` while tuning AI paths or movement.
- Avoid mixing local and world vectors—convert using `TransformDirection`, `InverseTransformDirection`, or their point equivalents before combining.
- Keep inputs normalized when feeding trig functions, quaternion constructors, or movement code expecting unit vectors.

A solid grasp of `Vector3` operations speeds up every gameplay feature that depends on position, direction, or movement. Lean on these helpers to write expressive, intention-revealing code.
