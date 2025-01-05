# Rotate Object

#### Transform.rotation
```csharp
// A Quaternion stores the rotation of the Transform in world space.
// Quaternions are based on complex numbers and don't suffer from gimbal lock.
// Unity internally uses Quaternions to represent all rotations.

transform.rotation = new Quaternion(rotx, roty, rotz, rotw);
```

#### Transform.eulerAngles
```csharp
// Transform.eulerAngles represents rotation in world space. 
// It is important to understand that although you are providing X, Y, and Z rotation values to describe your rotation
// those values are not stored in the rotation. Instead, the X, Y & Z values are converted to the Quaternion's internal format.

transform.eulerAngles = Vector3(rotx, roty, rotz);
```

#### Transform.Rotate()
```csharp
// Applies rotation around all the given axes.
public void Rotate(Vector3 eulers, Space relativeTo = Space.Self);
public void Rotate(float xAngle, float yAngle, float zAngle, Space relativeTo = Space.Self);

transform.Rotate(rotx, roty, rotz);
```

#### Transform.RotateAround()
```csharp
// Rotates the transform about axis passing through point in world coordinates by angle degrees.
public void RotateAround(Vector3 point, Vector3 axis, float angle);

// Spin the object around the target at 20 degrees/second.
Transform target;
transform.RotateAround(target.position, Vector3.up, 20 * Time.deltaTime);
```

#### Transform.LookAt()
```csharp
// Points the positive 'Z' (forward) side of an object at a position in world space.
public void LookAt(Transform target);
public void LookAt(Transform target, Vector3 worldUp = Vector3.up);

// Rotate the object's forward vector to point at the target Transform.
Transform target;
transform.LookAt(target);

// Same as above, but setting the worldUp parameter to Vector3.left in this example turns the object on its side.
transform.LookAt(target, Vector3.left);
```

#### Quaternion.LookRotation()
```csharp
// Creates a rotation with the specified forward and upwards directions.
public static Quaternion LookRotation(Vector3 forward, Vector3 upwards = Vector3.up);

// The following code rotates the object towards a target object.
Vector3 direction = target.position - transform.position;
Quaternion rotation = Quaternion.LookRotation(direction);
transform.rotation = rotation;
```

#### Quaternion.FromToRotation()
```csharp
// Creates a rotation (a Quaternion) which rotates from fromDirection to toDirection.
public static Quaternion FromToRotation(Vector3 fromDirection, Vector3 toDirection);

// Sets the rotation so that the transform's y-axis goes along the z-axis.
transform.rotation = Quaternion.FromToRotation(Vector3.up, transform.forward);
```

#### Quaternion.ToAngleAxis()
```csharp
// Converts a rotation to angle-axis representation (angles in degrees).
// In other words, extracts the angle as well as the axis that this quaternion represents.
public void ToAngleAxis(out float angle, out Vector3 axis);

// Extracts the angle - axis rotation from the transform rotation
float angle = 0.0f;
Vector3 axis = Vector3.zero;
transform.rotation.ToAngleAxis(out angle, out axis);
```

