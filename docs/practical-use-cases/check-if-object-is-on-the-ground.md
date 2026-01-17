# Unity Ground Check - IsGrounded Detection

Determine whether a character or prop is grounded so you can enable jumping, play landing VFX, or swap movement modes. A downward raycast from the object is a robust approach when paired with layer filtering.

## Behaviour

1. Cast a ray downward from the object’s position (or slightly above the feet).
2. Limit the ray length to the distance from the origin to the ground, plus a small buffer.
3. Use a layer mask to hit only walkable surfaces and ignore triggers.
4. Treat a successful hit as “grounded” and optionally store the hit info for surface effects.

## Example

```csharp
using UnityEngine;

public class GroundedCheck : MonoBehaviour
{
    [SerializeField] private float groundCheckDistance = 0.6f;
    [SerializeField] private LayerMask groundLayers;

    public bool IsGrounded { get; private set; }
    public RaycastHit GroundHit { get; private set; }

    private void Update()
    {
        Vector3 origin = transform.position + Vector3.up * 0.1f; // lift slightly to avoid self-intersection
        IsGrounded = Physics.Raycast(origin, Vector3.down, out RaycastHit hit, groundCheckDistance, groundLayers, QueryTriggerInteraction.Ignore);

        if (IsGrounded)
        {
            GroundHit = hit;
        }
    }
}
```

### Notes

- Adjust `groundCheckDistance` to match your collider height or foot offset; too short can miss slopes, too long can falsely detect lower platforms.
- For capsule-based characters, blend this raycast with `CharacterController.isGrounded` for extra reliability.
- Use `GroundHit.normal` to align footsteps or to detect steep slopes before allowing jumps.
- Replace `Physics.Raycast` with `Physics.SphereCast` if you need a wider detection area for uneven terrain.
