# Make object look at the camera

```csharp
var camPosition = Camera.main.transform.position;

transform.rotation = Quaternion.LookRotation(transform.position - camPosition);
```

