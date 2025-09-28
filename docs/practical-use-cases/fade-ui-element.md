# Fade UI element

Smoothly show or hide world-space prompts, HUD panels, or tooltips by lerping a `CanvasGroup` alpha. Coroutines or tweens control the timing without needing a full animation clip.

## Behaviour

1. Cache the `CanvasGroup` component (add one if missing).
2. Start a coroutine when you want to fade in/out.
3. Lerping the alpha each frame moves the value toward the target.
4. Toggle `interactable` and `blocksRaycasts` only when the element is visible.

## Example

```csharp
using System.Collections;
using UnityEngine;

public class UIFader : MonoBehaviour
{
    [SerializeField] private CanvasGroup canvasGroup;
    [SerializeField] private float fadeDuration = 0.4f;

    private Coroutine currentFade;

    private void Awake()
    {
        if (!canvasGroup)
        {
            canvasGroup = GetComponent<CanvasGroup>();
        }

        if (!canvasGroup)
        {
            canvasGroup = gameObject.AddComponent<CanvasGroup>();
        }
    }

    public void FadeIn()
    {
        StartFade(1f);
    }

    public void FadeOut()
    {
        StartFade(0f);
    }

    private void StartFade(float targetAlpha)
    {
        if (currentFade != null)
        {
            StopCoroutine(currentFade);
        }

        currentFade = StartCoroutine(FadeRoutine(targetAlpha));
    }

    private IEnumerator FadeRoutine(float targetAlpha)
    {
        float startAlpha = canvasGroup.alpha;
        float time = 0f;

        bool show = targetAlpha > 0.99f;
        canvasGroup.interactable = show;
        canvasGroup.blocksRaycasts = show;

        while (time < fadeDuration)
        {
            time += Time.unscaledDeltaTime;
            float t = Mathf.Clamp01(time / fadeDuration);
            canvasGroup.alpha = Mathf.Lerp(startAlpha, targetAlpha, t);
            yield return null;
        }

        canvasGroup.alpha = targetAlpha;
        canvasGroup.interactable = targetAlpha > 0.99f;
        canvasGroup.blocksRaycasts = targetAlpha > 0.99f;
        currentFade = null;
    }
}
```

### Notes

- Swap `Time.unscaledDeltaTime` for `Time.deltaTime` if you want fades to obey time-scale changes.
- For instant toggles (e.g., initial state), set `canvasGroup.alpha` directly before starting a fade.
- Integrate with UI events: call `FadeIn` when the player enters a trigger and `FadeOut` after a timeout or exit.
- If you prefer not to use coroutines, drive the fade in `Update` by lerping toward the target alpha with your own timer.
