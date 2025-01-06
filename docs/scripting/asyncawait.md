# Async/Await

Async/await is a programming pattern that simplifies asynchronous programming. It allows you to write asynchronous code that looks and behaves like synchronous code. This is particularly useful for operations that might take time, such as:
- Loading resources
- Network requests
- File operations
- Scene loading

#### Basic Structure
```csharp
using UnityEngine;
using System.Threading.Tasks;
using System;

public class AsyncAwaitExample : MonoBehaviour
{
    // Basic async/await structure in Unity
    private async void Start()
    {
        Debug.Log("Starting async operation");
        await Task.Delay(1000); // Wait for 1 second
        Debug.Log("Async operation completed");
    }

    // IMPORTANT: Unity's Update loop and MonoBehaviour methods must be void
    // They cannot be async Task
    private void Update() { }      // Correct
    // private async Task Update() {} // Wrong!
}
```

#### Loading Resources
```csharp
// Loading resources asynchronously with progress tracking
private async Task<Texture2D> LoadTextureAsync()
{
    var resourcePath = "Textures/MyTexture";
    var request = Resources.LoadAsync<Texture2D>(resourcePath);
    
    while (!request.isDone)
    {
        // Report progress
        Debug.Log($"Loading: {request.progress * 100}%");
        await Task.Yield(); // Let other operations continue
    }

    return request.asset as Texture2D;
}
```

#### Web Requests
```csharp
// Making web requests with progress tracking
private async Task<string> FetchDataAsync(string url)
{
    using var request = UnityWebRequest.Get(url);
    var operation = request.SendWebRequest();

    while (!operation.isDone)
    {
        Debug.Log($"Downloading: {request.downloadProgress * 100}%");
        await Task.Yield();
    }

    if (request.result != UnityWebRequest.Result.Success)
        throw new Exception($"Failed to fetch data: {request.error}");

    return request.downloadHandler.text;
}
```

#### Scene Loading
```csharp
// Loading scenes asynchronously with progress tracking
private async Task LoadSceneAsync(string sceneName)
{
    var operation = SceneManager.LoadSceneAsync(sceneName);
    operation.allowSceneActivation = false; // Don't activate immediately

    while (operation.progress < 0.9f) // 0.9 is the progress before activation
    {
        Debug.Log($"Loading scene: {operation.progress * 100}%");
        await Task.Yield();
    }

    Debug.Log("Scene ready to activate");
    operation.allowSceneActivation = true;
}
```

#### Parallel Operations
```csharp
// Running multiple async operations in parallel
private async Task LoadGameAssetsAsync()
{
    try
    {
        // Start multiple operations simultaneously
        var textureTask = LoadTextureAsync();
        var dataTask = FetchDataAsync("https://api.example.com/gamedata");
        var sceneTask = LoadSceneAsync("Level1");

        // Wait for all tasks to complete
        await Task.WhenAll(textureTask, dataTask, sceneTask);
        
        // All assets are now loaded
        Debug.Log("All assets loaded successfully");
    }
    catch (Exception e)
    {
        Debug.LogError($"Failed to load assets: {e.Message}");
    }
}
```

#### Timeout Handling
```csharp
// Implementing timeout for async operations
private async Task<T> WithTimeout<T>(Task<T> task, TimeSpan timeout)
{
    var timeoutTask = Task.Delay(timeout);
    var completedTask = await Task.WhenAny(task, timeoutTask);
    
    if (completedTask == timeoutTask)
        throw new TimeoutException("Operation timed out");
            
    return await task; // Unwrap the result or propagate the exception
}

// Complete example using timeout handling
private async Task InitializeGameAsync()
{
    try
    {
        // Show loading screen
        ShowLoadingUI();

        // Start multiple loading operations with timeout
        var loadingTask = Task.WhenAll(
            LoadTextureAsync(),
            FetchDataAsync("https://api.example.com/gamedata"),
            LoadSceneAsync("MainLevel")
        );

        // Wait for all operations with a 30-second timeout
        await WithTimeout(loadingTask, TimeSpan.FromSeconds(30));

        // Hide loading screen
        HideLoadingUI();
        Debug.Log("Game initialized successfully");
    }
    catch (TimeoutException)
    {
        Debug.LogError("Game initialization timed out");
        ShowRetryButton();
    }
    catch (Exception e)
    {
        Debug.LogError($"Failed to initialize game: {e.Message}");
        ShowErrorUI();
    }
}
```

#### Best Practices
When using async/await in Unity, follow these best practices:

1. Always handle exceptions in async methods
2. Use Task.Yield() instead of Task.Delay() for frame-by-frame operations
3. Remember that async void should only be used for event handlers and MonoBehaviour methods
4. Use CancellationToken when possible to support cancellation
5. Implement timeout handling for network operations
6. Don't block the main thread with .Result or .Wait()
7. Use Task.WhenAll for parallel operations

