# Unity Cheat Sheet

## Table of Contents

- [Physics](#physics)

## Physics

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


