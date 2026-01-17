# Unity Keyboard Input - Legacy Input Manager

> **Note:** This page covers the **Legacy Input Manager**. For Unity 6+ projects, see the [New Input System](new-input-system.md) which is now the standard.

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

