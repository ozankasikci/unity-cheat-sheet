# State Pattern

The State Pattern allows an object to alter its behavior when its internal state changes. It encapsulates state-specific behavior and makes state transitions explicit.

#### Basic Example
```csharp
// State interface
public interface IState {
    void Enter();
    void Update();
    void Exit();
}

// Example state implementation
public class IdleState : IState {
    public void Enter() => Debug.Log("Entered Idle State");
    public void Update() => Debug.Log("Updating Idle State");
    public void Exit() => Debug.Log("Exited Idle State");
}

// State machine that manages state transitions
public class StateMachine : MonoBehaviour {
    private IState currentState;

    public void ChangeState(IState newState) {
        currentState?.Exit();
        currentState = newState;
        currentState?.Enter();
    }

    private void Update() {
        currentState?.Update();
    }
}
```

#### Detailed Example
See the [State Pattern - Onboarding Example](Patterns/StatePattern/README.md) for a complete example showing how to implement a game onboarding system using the State Pattern.

