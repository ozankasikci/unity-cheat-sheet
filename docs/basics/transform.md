# Transform

```csharp
// Transform is a fundamental component in Unity that every GameObject has.
// It defines the object's Position, Rotation, and Scale in the game world.

// Access the transform component
Transform transform = gameObject.transform;

// Position: Vector3 representing world space coordinates (x, y, z)
transform.position = new Vector3(0, 2, 0);      // Set absolute position
transform.localPosition = Vector3.zero;         // Position relative to parent

// Rotation: Can be set using Euler angles (degrees) or Quaternions
transform.rotation = Quaternion.identity;       // No rotation
transform.eulerAngles = new Vector3(0, 90, 0);  // Rotate 90 degrees around Y axis
transform.localRotation = Quaternion.identity;  // Rotation relative to parent

// Scale: Vector3 representing scale on each axis
transform.localScale = Vector3.one;             // Normal scale (1, 1, 1)
transform.localScale = new Vector3(2, 2, 2);    // Double size on all axes

// Parent-Child Relationships
transform.parent = anotherObject.transform;     // Set parent
transform.SetParent(null);                      // Remove parent (make root)
```

