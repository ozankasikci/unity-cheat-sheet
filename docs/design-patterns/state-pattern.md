# Unity State Pattern - Finite State Machines

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

#### Detailed Example - Game Onboarding System
A complete example showing how to implement a game onboarding/tutorial system using the State Pattern. This implementation demonstrates how to:
- Manage different tutorial states (movement, combat, inventory)
- Handle state transitions
- Track player progress through the tutorial

👉 [View Full Implementation](https://github.com/ozankasikci/unity-cheat-sheet/tree/master/Patterns/StatePattern/README.md)

