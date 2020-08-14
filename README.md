# Unity Cheat Sheet

## Table of Contents

- [Vector3](vector3)
  - [Basics](#basics) 
- [Physics](#physics)
  - [Move Object](#move-object) 
  - [Rotate Object](#rotate-object) 
- [Input](#input)
  - [Keyboard](#keyboard) 
  - [Mouse](#mouse) 
- [Design Patterns](#design-patterns)
  - [Singleton](#singleton) 
- [Practical Use Cases](#practical-use-cases)

## Vector3

### Basics

```csharp
// Vector3 is representation of 3D vectors and points, used to represent 3D positions,considering x,y & z axis.

Vector3 v = new Vector3(0f, 0f, 0f);
```

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
// Applies rotation around all the given axes.

transform.Rotate(rotx, roty, rotz);
```

```csharp
// Transform.eulerAngles represents rotation in world space. 
// It is important to understand that although you are providing X, Y, and Z rotation values to describe your rotation
// those values are not stored in the rotation. Instead, the X, Y & Z values are converted to the Quaternion's internal format.

transform.eulerAngles = Vector3(rotx, roty, rotz);
```

## Input

### Keyboard

```csharp
// Returns true during the frame the user starts pressing down the key
if (Input.GetKeyDown(KeyCode.Space)) {
    Debug.Log("Space key was pressed");
}

// Jump is also set to space in Input Manager
if (Input.GetButtonDown("Jump")) {
    Debug.Log("Do something");
}
```

### Mouse

```csharp
if (Input.GetAxis("Mouse X") < 0) {
    Debug.Log("Mouse moved left");
}

if (Input.GetAxis("Mouse Y") > 0) {
    Debug.Log("Mouse moved up");
}

if (Input.GetMouseButtonDown(0)) {
    Debug.Log("Pressed primary button.");
}

if (Input.GetMouseButtonDown(1)) {
    Debug.Log("Pressed secondary button.");
}

if (Input.GetMouseButtonDown(2)) {
    Debug.Log("Pressed middle click.");
}
```

## Design Patterns

### Singleton

```csharp
// Define singleton class
public class SingletonClass: MonoBehaviour {
    private static SomeClass instance;

    public static SomeClass Instance { get { return instance; } }

    private void Awake() {
        if (instance != null && instance != this) {
            Destroy(this.gameObject);
        } else {
            instance = this;
        }
    }
}

// Use it in another class
public class AnotherClass: MonoBehaviour {
    public Singleton instance;

    private void Awake() {
       instance = Singleton.Instance;
    }
}
```

## Practical Use Cases

### Check if object is on the ground

```csharp
RaycastHit hit;

// Unlike this example, most of the time you should pass a layerMask as the last option to hit only to the ground
if (Physics.Raycast(transform.position, -Vector3.up, out hit, 0.5f)) {
   Debug.log("Hit something below!")
}
```

