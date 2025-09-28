# Camera follow & orbit

Smoothly follow a target while allowing mouse or controller input to orbit around it. Combine `Vector3.SmoothDamp` for damped position tracking with `Quaternion.AngleAxis` to accumulate yaw and pitch angles.

## Behaviour

1. Read orbit input (mouse X/Y, right stick, or custom axes).
2. Accumulate yaw and pitch, clamping pitch to avoid flipping.
3. Convert the yaw/pitch pair into a rotation using `Quaternion.AngleAxis`.
4. Rotate the follow offset by that rotation to get the desired camera position.
5. Smoothly move the camera toward that position with `Vector3.SmoothDamp`.
6. Look back at the target so the camera always faces it.

## Example

```csharp
using UnityEngine;

public class OrbitFollowCamera : MonoBehaviour
{
    [SerializeField] private Transform target;
    [SerializeField] private Vector3 followOffset = new Vector3(0f, 3f, -6f);
    [SerializeField] private float followSmoothTime = 0.2f;
    [SerializeField] private float orbitSpeed = 120f;
    [SerializeField] private Vector2 pitchLimits = new Vector2(-30f, 60f);

    private Vector3 velocity;    // reused by SmoothDamp
    private float yaw;           // around global Y (left/right orbit)
    private float pitch;         // around local X (up/down orbit)

    private void Awake()
    {
        if (!target)
        {
            enabled = false;
            Debug.LogWarning("OrbitFollowCamera disabled: target not assigned.", this);
            return;
        }

        Vector3 toTarget = target.position - transform.position;
        Quaternion initialLook = Quaternion.LookRotation(toTarget, Vector3.up);
        yaw = initialLook.eulerAngles.y;
        pitch = initialLook.eulerAngles.x;
    }

    private void LateUpdate()
    {
        Vector2 orbitInput = new Vector2(
            Input.GetAxis("Mouse X") + Input.GetAxis("CameraHorizontal"),
            Input.GetAxis("Mouse Y") + Input.GetAxis("CameraVertical")
        );

        yaw += orbitInput.x * orbitSpeed * Time.deltaTime;
        pitch -= orbitInput.y * orbitSpeed * Time.deltaTime;
        pitch = Mathf.Clamp(pitch, pitchLimits.x, pitchLimits.y);

        Quaternion orbitRotation = Quaternion.AngleAxis(yaw, Vector3.up) *
                                   Quaternion.AngleAxis(pitch, Vector3.right);

        Vector3 desiredPosition = target.position + orbitRotation * followOffset;
        transform.position = Vector3.SmoothDamp(transform.position, desiredPosition, ref velocity, followSmoothTime);
        transform.rotation = Quaternion.LookRotation(target.position - transform.position, Vector3.up);
    }
}
```

### Notes

- `CameraHorizontal` / `CameraVertical` input axes are optional right-stick mappings—remove them if you only use mouse input.
- Tighten or loosen the orbit responsiveness by scaling `orbitSpeed` and `followSmoothTime`.
- Changing `followOffset` in play mode lets you feel how different camera rigs behave (over-the-shoulder vs. top-down).
- Use `LateUpdate` to follow targets that move in `Update`, ensuring the camera reacts after the character has moved.
- Swap `Vector3.SmoothDamp` for `Vector3.MoveTowards` if you prefer instant snapping without easing.
