# Load next scene

```csharp
var nextSceneToLoad = SceneManager.GetActiveScene().buildIndex + 1;
var totalSceneCount = SceneManager.sceneCountInBuildSettings;

if (nextSceneToLoad < totalSceneCount) {
  SceneManager.LoadScene(nextSceneToLoad);
}