# Unity Raycast - Physics Ray Detection

Physics raycasts let you probe the world along a straight line to discover what you would hit. They are a foundational building block for many systems—targeting, line of sight, shooting, interaction prompts, AI perception, and more. Understanding the different overloads, hit data, and performance implications is key to writing reliable gameplay code.

## Core Example

```csharp
using UnityEngine;

public class ForwardScanner : MonoBehaviour
{
    [SerializeField] private float maxDistance = 10f;
    [SerializeField] private LayerMask obstacleLayers = Physics.DefaultRaycastLayers;

    private void Update()
    {
        var origin = transform.position;
        var direction = transform.forward;

        if (Physics.Raycast(origin, direction, out RaycastHit hitInfo, maxDistance, obstacleLayers))
        {
            Debug.DrawRay(origin, direction * hitInfo.distance, Color.yellow);
            Debug.Log($"Hit {hitInfo.collider.name} at {hitInfo.point}");
        }
        else
        {
            Debug.DrawRay(origin, direction * maxDistance, Color.green);
        }
    }
}
```

### Key Parameters
- `origin` – world position the ray starts from.
- `direction` – normalized direction of the ray. Unity will normalize the vector internally, but passing a normalized value avoids unnecessary work.
- `maxDistance` – how far the ray should travel. Use a reasonable distance; `Mathf.Infinity` works but costs more because Unity checks farther.
- `layerMask` – determines which physics layers will be considered. Build masks with `LayerMask` fields in the inspector or bit shifting (`1 << layerIndex`).
- `queryTriggerInteraction` – optional parameter controlling whether trigger colliders are hit (`UseGlobal`, `Ignore`, `Collide`).

## Working With Layer Masks

Filtering is critical so that raycasts only interact with relevant colliders.

```csharp
// Only hit environment and interactable layers.
LayerMask mask = LayerMask.GetMask("Environment", "Interactable");

// Exclude the Player layer by inverting a single bit.
int excludePlayerMask = ~(1 << LayerMask.NameToLayer("Player"));

if (Physics.Raycast(origin, direction, out RaycastHit hit, maxDistance, mask & excludePlayerMask))
{
    // Handle hit
}
```

Use the inspector to configure masks when possible—the serialized `LayerMask` property automatically handles bit math and is less error-prone than hard-coded integers.

## Reading RaycastHit Data

When the ray hits a collider, `RaycastHit` gives you:
- `hit.collider` – the collider component struck.
- `hit.point` – world-space point of impact.
- `hit.normal` – surface normal at the hit point (useful for placing decals or aligning objects).
- `hit.distance` – distance from origin to the impact.
- `hit.rigidbody` or `hit.transform` – convenient shortcuts to the impacted object.

Example: placing an indicator where the ray collides with the world.

```csharp
if (Physics.Raycast(ray, out RaycastHit hit))
{
    indicator.transform.position = hit.point;
    indicator.transform.rotation = Quaternion.LookRotation(hit.normal);
}
```

## Variants and Overloads

Unity provides several raycast helpers:

- `Physics.Raycast(Ray ray, ...)` – cast using a `Ray` struct, handy with camera screen-point rays.
- `Physics.RaycastAll` – returns every hit along the ray. Useful for penetrating shots or picking the nearest manually. Beware of additional allocations and sorting.
- `Physics.RaycastNonAlloc` – fills a preallocated array with hits to avoid garbage collection. Manage the array size to the maximum expected hits.
- `Physics.SphereCast`, `Physics.CapsuleCast`, `Physics.BoxCast` – volume-based sweeps that simulate shapes moving along a ray. Good for detecting hits for wider projectiles or character collision prediction.

```csharp
RaycastHit[] hits = new RaycastHit[8];
int count = Physics.RaycastNonAlloc(origin, direction, hits, maxDistance, obstacleLayers);
for (int i = 0; i < count; i++)
{
    // Process hits[i]
}
```

## 2D Physics Equivalent

For projects using the 2D physics engine, use the Physics2D API:

```csharp
RaycastHit2D hit = Physics2D.Raycast(origin2D, direction2D, maxDistance, obstacleLayers);
if (hit.collider != null)
{
    Debug.Log($"Hit {hit.collider.name} at {hit.point}");
}
```

2D physics queries live in `Physics2D`, return `RaycastHit2D`, and rely on `LayerMask`s just like their 3D counterparts.

## Debugging Raycasts

- `Debug.DrawRay` and `Debug.DrawLine` visualize rays in the Scene view.
- `Physics.Debug.DrawRay` (Unity 2022.2+) draws with duration and depth-testing options.
- Enable Gizmos in the Scene/Game view during play mode to see the debug lines.
- In the Physics Debug window (`Window > Analysis > Physics Debugger`), enable “Contacts” and “Queries” to inspect interactions in real time.

## Best Practices

- **Use FixedUpdate for physics-driven logic.** If a ray triggers a physics reaction (forces, Rigidbody movement), keep it in `FixedUpdate`. Casting from input can happen in `Update`, but apply physics responses later.
- **Normalize direction vectors** and reuse them when possible.
- **Limit query distance** to the shortest meaningful range for better performance and fewer accidental hits.
- **Cache frequently used layer masks** to avoid rebuilding them every frame.
- **Avoid per-frame RaycastAll unless needed.** It allocates arrays and sorts internally; prefer `Raycast` or `RaycastNonAlloc` in hot paths.
- **Mind triggers.** Set `queryTriggerInteraction` explicitly when you rely on triggers; default behaviour follows project settings.
- **Test from multiple origins.** Player eyes, weapon muzzles, or camera positions can produce different results—prototype with gizmos to confirm alignment.

## Common Use Cases

- **Line of sight:** Cast from AI to targets to confirm visibility.
- **Hit-scan weapons:** Raycast from the weapon muzzle to determine impact point and spawn decals or particle effects.
- **Interaction prompts:** Cast from the camera center to highlight selectable objects within reach.
- **Surface alignment:** Sample normals to orient decals, footsteps, or procedurally placed objects.
- **Ground checks:** Cast downwards to confirm the player is grounded when jump logic needs certainty.

Use raycasts as the starting point for more complex physics logic, and layer them with additional checks (dot products, tag comparisons, distance thresholds) to build robust gameplay systems.
