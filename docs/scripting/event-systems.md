# Unity Events - UnityEvent and C# Delegates

Unity provides several ways to handle events in your games. Here are the main approaches:

#### UnityEvents
UnityEvents are serializable events that can be configured in the Inspector and used in scripts.

```csharp
using UnityEngine;
using UnityEngine.Events;

// Basic UnityEvent
public class BasicEventExample : MonoBehaviour {
    // This will show up in the inspector
    public UnityEvent onGameStart;
    
    void Start() {
        // Invoke the event
        onGameStart?.Invoke();
    }
}

// UnityEvent with parameters
[System.Serializable]
public class ScoreEvent : UnityEvent<int> { }

public class ParameterizedEventExample : MonoBehaviour {
    public ScoreEvent onScoreChanged;
    private int score = 0;

    public void AddScore(int points) {
        score += points;
        onScoreChanged?.Invoke(score);
    }
}
```

#### C# Events and Delegates
Traditional C# events provide a more code-based approach to event handling.


Delegates are type-safe function pointers, and events are a way to broadcast messages to multiple listeners.

```csharp
public class GameEvents : MonoBehaviour {
    // Delegate definition
    public delegate void GameStateHandler();
    public delegate void ScoreHandler(int newScore);

    // Event declaration
    public static event GameStateHandler OnGameStart;
    public static event GameStateHandler OnGameOver;
    public static event ScoreHandler OnScoreChanged;

    // Methods to trigger events
    public static void TriggerGameStart() {
        OnGameStart?.Invoke();
    }

    public static void TriggerGameOver() {
        OnGameOver?.Invoke();
    }

    public static void TriggerScoreChanged(int newScore) {
        OnScoreChanged?.Invoke(newScore);
    }
}

// Example usage in another class
public class Player : MonoBehaviour {
    void OnEnable() {
        // Subscribe to events
        GameEvents.OnGameStart += HandleGameStart;
        GameEvents.OnGameOver += HandleGameOver;
    }

    void OnDisable() {
        // Unsubscribe from events
        GameEvents.OnGameStart -= HandleGameStart;
        GameEvents.OnGameOver -= HandleGameOver;
    }

    private void HandleGameStart() {
        Debug.Log("Game Started!");
    }

    private void HandleGameOver() {
        Debug.Log("Game Over!");
    }
}
```

