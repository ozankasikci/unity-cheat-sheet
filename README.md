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
transform.rotation = new Quaternion(rotx, roty, rotz, rotw);
```

```csharp
transform.Rotate(rotx, roty, rotz);
```

```csharp
transform.eulerAngles = Vector3(rotx, roty, rotz);
```

