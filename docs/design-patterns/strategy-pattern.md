# Strategy Pattern

The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. This pattern lets the algorithm vary independently from clients that use it.

#### Basic Example
```csharp
// Strategy interface
public interface IStrategy {
    void Execute();
}

// Example strategy implementation
public class AttackStrategy : IStrategy {
    public void Execute() => Debug.Log("Performing attack!");
}

// Context class that uses the strategy
public class Character : MonoBehaviour {
    private IStrategy strategy;

    public void SetStrategy(IStrategy newStrategy) {
        strategy = newStrategy;
    }

    public void ExecuteStrategy() {
        strategy?.Execute();
    }
}
```

#### Detailed Example
See the [Strategy Pattern - Combat System Example](Patterns/StrategyPattern/README.md) for a complete example showing how to implement a combat system using the Strategy Pattern.

