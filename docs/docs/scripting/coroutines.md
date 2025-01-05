# Coroutines

Coroutines in Unity are a powerful feature that allows you to pause the execution of a function and resume it later. This is particularly useful for tasks that need to be spread over several frames, such as animations, waiting for a condition to be met, or handling asynchronous operations.

#### Basic Coroutine Example
```csharp
using UnityEngine;
using System.Collections;

public class CoroutineExample : MonoBehaviour {
    void Start() {
        // Start the coroutine
        StartCoroutine(ExampleCoroutine());
    }

    IEnumerator ExampleCoroutine() {
        Debug.Log("Coroutine started");

        // Wait for 2 seconds
        yield return new WaitForSeconds(2);

        Debug.Log("Coroutine resumed after 2 seconds");
    }
}
```

#### Using Coroutines for Repeated Actions
Coroutines can be used to perform repeated actions with a delay between each iteration.

```csharp
IEnumerator RepeatActionCoroutine() {
    while (true) {
        Debug.Log("Action performed");
        
        // Wait for 1 second before repeating
        yield return new WaitForSeconds(1);
    }
}

// Start the coroutine
StartCoroutine(RepeatActionCoroutine());
```

#### Waiting for a Condition
Coroutines can also wait for a condition to be true before continuing execution.

```csharp
IEnumerator WaitForConditionCoroutine() {
    Debug.Log("Waiting for condition...");

    // Wait until the condition is met
    yield return new WaitUntil(() => SomeConditionIsTrue());

    Debug.Log("Condition met, resuming coroutine");
}

bool SomeConditionIsTrue() {
    // Replace with your actual condition
    return Time.time > 5;
}

// Start the coroutine
StartCoroutine(WaitForConditionCoroutine());
```

#### Using Coroutines with Unity Events
Coroutines can be used to handle events over time, such as fading out a UI element.

```csharp
IEnumerator FadeOutCoroutine(CanvasGroup canvasGroup, float duration) {
    float startAlpha = canvasGroup.alpha;
    float rate = 1.0f / duration;
    float progress = 0.0f;

    while (progress < 1.0f) {
        canvasGroup.alpha = Mathf.Lerp(startAlpha, 0, progress);
        progress += rate * Time.deltaTime;

        yield return null; // Wait for the next frame
    }

    canvasGroup.alpha = 0;
}

// Usage
CanvasGroup myCanvasGroup = GetComponent<CanvasGroup>();
StartCoroutine(FadeOutCoroutine(myCanvasGroup, 2.0f));
```

#### Stopping Coroutines
You can stop a coroutine using `StopCoroutine()` or `StopAllCoroutines()`.

```csharp
Coroutine myCoroutine;

void Start() {
    myCoroutine = StartCoroutine(ExampleCoroutine());
}

void StopMyCoroutine() {
    if (myCoroutine != null) {
        StopCoroutine(myCoroutine);
    }
}

void StopAllMyCoroutines() {
    StopAllCoroutines();
}
```

#### Important Notes
- Coroutines are not threads. They run on the main thread and are subject to the same performance constraints.
- Use `yield return null;` to wait for the next frame.
- Use `yield return new WaitForSeconds(seconds);` to wait for a specific amount of time.
- Use `yield return new WaitUntil(() => condition);` to wait until a condition is true.
- Coroutines can be nested, and you can yield return other coroutines.

