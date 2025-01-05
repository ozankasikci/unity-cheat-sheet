# Quaternion

```csharp
// A Quaternion stores the rotation of the Transform in world space.
// Quaternions are based on complex numbers and don't suffer from gimbal lock.
// Unity internally uses Quaternions to represent all rotations.
// You almost never access or modify individual Quaternion components (x,y,z,w); 

// A rotation 30 degrees around the y-axis
Quaternion rotation = Quaternion.Euler(0, 30, 0);
```

