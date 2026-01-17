# Unity Billboard - Make Object Look At Camera

Keep UI elements or billboards facing the active camera so they remain legible and always visible. `Quaternion.LookRotation` re-orients the forward vector toward the camera while optionally locking a specific axis.

## Behaviour

1. Cache a reference to the camera transform you want to face.
2. Compute the direction from the object to the camera.
3. Zero out axes you want to lock (e.g., keep billboards upright).
4. Use `Quaternion.LookRotation` to orient the object toward that direction.
5. Update in `LateUpdate` so the facing happens after camera movement.

## Example

```csharp
using UnityEngine;

public class BillboardToCamera : MonoBehaviour
{
    [SerializeField] private Transform cameraTransform;
    [SerializeField] private bool lockY = true; // keep upright for world-space UI

    private void Awake()
    {
        if (!cameraTransform)
        {
            Camera mainCam = Camera.main;
            cameraTransform = mainCam ? mainCam.transform : null;
        }
    }

    private void LateUpdate()
    {
        if (!cameraTransform) return;

        Vector3 direction = cameraTransform.position - transform.position;

        if (lockY)
        {
            direction.y = 0f;
            if (direction.sqrMagnitude < 0.0001f)
            {
                return; // avoid invalid look rotation
            }
        }

        transform.rotation = Quaternion.LookRotation(direction, Vector3.up);
    }
}
```

### Notes

- For UI canvases, ensure the canvas render mode is **World Space** or **Camera** to observe the effect.
- Locking Y prevents the object from tilting on steep camera angles—disable it for effects that should fully track the camera.
- If several billboards exist, cache the camera transform in a shared manager to avoid repeated `Camera.main` calls.
- Use `transform.LookAt(cameraTransform)` as a shorthand when you do not need axis locking.
