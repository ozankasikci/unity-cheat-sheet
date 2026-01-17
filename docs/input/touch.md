# Unity Touch Input - Legacy Input Manager

> **Note:** This page covers the **Legacy Input Manager**. For Unity 6+ projects, see the [New Input System](new-input-system.md) which is now the standard.

```csharp
if (Input.touchCount > 0) {
    touch = Input.GetTouch(0);

    if (touch.phase == TouchPhase.Began) {
        Debug.Log("Touch began");
    }

    if (touch.phase == TouchPhase.Moved) {
        Debug.Log("Touch moves");
    }

    if (touch.phase == TouchPhase.Ended) {
        Debug.Log("Touch ended");
    }
}
```

