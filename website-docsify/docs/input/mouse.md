# Mouse

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