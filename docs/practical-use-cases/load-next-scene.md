# Load next scene

Advance to the next scene in the build index after completing a level or finishing a cutscene. Guard the call so it only loads when another scene exists to avoid index errors.

## Behaviour

1. Read the active scene’s build index.
2. Add one to get the next index.
3. Check against `SceneManager.sceneCountInBuildSettings` to ensure the scene exists.
4. Load the next scene either synchronously (`LoadScene`) or asynchronously (`LoadSceneAsync`).

## Example

```csharp
using UnityEngine;
using UnityEngine.SceneManagement;

public class LoadNextSceneOnTrigger : MonoBehaviour
{
    [SerializeField] private string loadingScreenScene; // optional additive scene for transitions

    public void LoadNext()
    {
        int currentIndex = SceneManager.GetActiveScene().buildIndex;
        int nextIndex = currentIndex + 1;
        int sceneCount = SceneManager.sceneCountInBuildSettings;

        if (nextIndex >= sceneCount)
        {
            Debug.Log("No more scenes to load.");
            return;
        }

        if (!string.IsNullOrEmpty(loadingScreenScene))
        {
            SceneManager.LoadScene(loadingScreenScene, LoadSceneMode.Additive);
        }

        SceneManager.LoadScene(nextIndex);
    }
}
```

### Notes

- Use `LoadSceneAsync` when you want to show loading UI or stream large levels.
- If you reorder scenes, remember to keep build indices updated via **File → Build Settings**.
- For looping gameplay (e.g., endless runner), wrap the index manually or return to a menu scene instead of logging.
- In additive workflows, unload the loading screen or previous scenes once the new scene is ready to avoid duplicates.
