# Unity Cheat Sheet

## Table of Contents

- [Physics](#physics)
  - [Move Object](#move-object) 
  - [Rotate Object](#rotate-object) 

## Physics

### Move Object 
```csharp
// Moves the transform in the direction and distance of translation.

transform.Translate(Vector3.right * movementSpeed * Time.deltaTime);
```

```csharp
// Calculate a position between the points specified by current and target
// Moving no farther than the distance specified by maxDistanceDelta

Vector3 targetPosition;
transform.position = Vector3.MoveTowards(transform.position, targetPosition, Time.deltaTime);
```

```csharp
// Linearly interpolates between two points. Results in a smooth transition.

Vector3 targetPosition;
float t = 0;
t += Time.deltaTime * speed;
transform.position = Vector3.Lerp(transform.position, targetPosition, t);
```

### Rotate Object 
```csharp
// A Quaternion stores the rotation of the Transform in world space.
// Quaternions are based on complex numbers and don't suffer from gimbal lock.
// Unity internally uses Quaternions to represent all rotations.

transform.rotation = new Quaternion(rotx, roty, rotz, rotw);
```

```csharp
// Applies rotation around all the given axises.

transform.Rotate(rotx, roty, rotz);
```

```csharp
// Transform.eulerAngles represents rotation in world space. 
// It is important to understand that although you are providing X, Y, and Z rotation values to describe your rotation
// those values are not stored in the rotation. Instead, the X, Y & Z values are converted to the Quaternion's internal format.

transform.eulerAngles = Vector3(rotx, roty, rotz);
```

