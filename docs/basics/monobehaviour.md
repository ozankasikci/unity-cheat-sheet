# Unity MonoBehaviour - Lifecycle Methods and Events

`MonoBehaviour` is the base class that gives Unity scripts their lifecycle hooks, inspector exposure, and access to coroutines. Almost every gameplay script you write will inherit from it, so knowing when Unity invokes each callback is crucial.

👉 [Official Execution Order Chart](https://docs.unity3d.com/uploads/Main/monobehaviour_flowchart.svg)

## Lifecycle Overview

| Phase | Callback | Notes |
| --- | --- | --- |
| Initialization | `Awake()` | Called once when the script instance loads. Setup references here, even if the object is disabled. |
| Initialization | `OnEnable()` | Fires every time the component or GameObject becomes enabled. Pair with `OnDisable()`. |
| Post-Initialization | `Start()` | Runs on the first frame when the script is enabled. All other components have finished their `Awake()`. |
| Frame Update | `Update()` | Per-frame logic tied to the render loop. Use for input polling or timers. |
| Physics Step | `FixedUpdate()` | Runs at a fixed timestep (default 0.02s). Apply physics forces here. |
| Late Frame | `LateUpdate()` | Executes after all `Update()` calls. Good for camera follow logic. |
| GUI | `OnGUI()` | Legacy IMGUI rendering. Use sparingly; Canvas UI is the modern alternative. |
| Disable/Destroy | `OnDisable()`, `OnDestroy()` | Clean up listeners, dispose resources. `OnDestroy` fires even if an object is unloaded when changing scenes. |
| App Events | `OnApplicationPause`, `OnApplicationFocus`, `OnApplicationQuit` | Respond to platform-level state changes (mobile suspend, OS focus). |

### Execution Order Example

```csharp
using UnityEngine;

public class LifecycleLogger : MonoBehaviour
{
    private void Awake() => Debug.Log("Awake");
    private void OnEnable() => Debug.Log("OnEnable");
    private void Start() => Debug.Log("Start");
    private void Update() => Debug.Log("Update");
    private void LateUpdate() => Debug.Log("LateUpdate");
    private void OnDisable() => Debug.Log("OnDisable");
    private void OnDestroy() => Debug.Log("OnDestroy");
}
```

Place the script on a GameObject and toggle it in Play Mode to observe the order in the Console. Remember that disabling and re-enabling the GameObject will call `OnDisable()`/`OnEnable()` without re-running `Awake()` or `Start()`.

## Coroutines

MonoBehaviours can start coroutines, which are methods returning `IEnumerator`. They let you sequence actions over time without blocking the main thread.

```csharp
private void Start()
{
    StartCoroutine(FadeOutRoutine());
}

private IEnumerator FadeOutRoutine()
{
    float elapsed = 0f;
    while (elapsed < 1f)
    {
        elapsed += Time.deltaTime;
        yield return null; // Wait for next frame
    }
}
```

Use `StopCoroutine` or `StopAllCoroutines` in `OnDisable()` to ensure clean shutdowns when objects are turned off.

## Managing Execution Order

- Unity calls all `Awake()` methods before any `Start()`. If you depend on another script’s initialization, fetch references in `Awake()` but use them in `Start()`.
- Adjust script execution order via **Project Settings > Script Execution Order** when systems have strict dependencies. Alternatively, add `[DefaultExecutionOrder(n)]` on the class to bake order into the script.
- Avoid heavy work in `Awake()`/`Start()` when loading scenes; consider async loading or lazy initialization instead.

## Best Practices

- Cache component references in `Awake()` to avoid repeated `GetComponent` calls during `Update()`.
- Split responsibilities: `Update()` for input/state checks, `FixedUpdate()` for physics, `LateUpdate()` for camera post-processing.
- Guard event subscriptions: subscribe in `OnEnable()`, unsubscribe in `OnDisable()` to prevent leaks.
- Prefer dependency injection or serialized fields over `FindObjectOfType`, which is slow and brittle.
- Do not rely on constructors—Unity bypasses them when instantiating MonoBehaviours.

## Common Pitfalls

- **Missing `Start()` on disabled objects:** Unity calls `Awake()` even if the GameObject is inactive, but `Start()` waits until it becomes active.
- **Destroying during iteration:** Removing objects inside `Update()` loops can cause unexpected behaviour; queue destruction with `Destroy(gameObject)` and let Unity handle it at frame end.
- **Physics in Update:** Applying forces or reading Rigidbody properties in `Update()` creates jitter. Use `FixedUpdate()` and `Time.fixedDeltaTime`.
- **Coroutines on disabled scripts:** Starting a coroutine while disabled does nothing. Ensure the MonoBehaviour is enabled first.

Understanding the MonoBehaviour lifecycle gives you predictable, testable scripts that cooperate with Unity’s engine loops. Combine these callbacks thoughtfully to build responsive gameplay systems.
