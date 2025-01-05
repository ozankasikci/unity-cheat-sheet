# Chain of Responsibility Pattern

The Chain of Responsibility pattern creates a chain of handler objects for a request. Each handler contains a reference to the next handler in the chain and decides either to handle the request or pass it to the next handler.

> 📘 **See the detailed example: [Chain of Responsibility - Input Handling Example](Patterns/ChainOfResponsibility/README.md)**  
> A complete example showing how to implement a game input handling system using the Chain of Responsibility Pattern.

#### Basic Example
```csharp
// Handler interface
public interface IHandler {
    void SetNext(IHandler handler);
    void HandleRequest(string request);
}

// Base handler class
public abstract class BaseHandler : IHandler {
    protected IHandler nextHandler;

    public void SetNext(IHandler handler) {
        nextHandler = handler;
    }

    public virtual void HandleRequest(string request) {
        if (nextHandler != null) {
            nextHandler.HandleRequest(request);
        }
    }
}

// Concrete handlers
public class UIHandler : BaseHandler {
    public override void HandleRequest(string request) {
        if (request == "UI_CLICK") {
            Debug.Log("UI Handler: Handling UI click");
        } else {
            base.HandleRequest(request);
        }
    }
}

public class GameplayHandler : BaseHandler {
    public override void HandleRequest(string request) {
        if (request == "PLAYER_MOVE") {
            Debug.Log("Gameplay Handler: Handling player movement");
        } else {
            base.HandleRequest(request);
        }
    }
}

// Usage
public class InputManager : MonoBehaviour {
    private IHandler handlerChain;

    private void Start() {
        // Set up the chain
        var uiHandler = new UIHandler();
        var gameplayHandler = new GameplayHandler();
        
        uiHandler.SetNext(gameplayHandler);
        handlerChain = uiHandler;
    }

    private void Update() {
        // Example: Process different types of input
        if (Input.GetMouseButtonDown(0)) {
            handlerChain.HandleRequest("UI_CLICK");
        }
        if (Input.GetKeyDown(KeyCode.W)) {
            handlerChain.HandleRequest("PLAYER_MOVE");
        }
    }
}
```

