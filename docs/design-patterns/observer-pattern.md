# Unity Observer Pattern - Event-Driven Architecture

```csharp
// Observer interface
public interface IObserver {
    void UpdateObserver(string message);
}

// Concrete implementation of the observer
public class ConcreteObserver : IObserver {
    private string name;

    public ConcreteObserver(string name) {
        this.name = name;
    }

    public void UpdateObserver(string message) {
        Debug.Log($"{name} received message: {message}");
    }
}

// Subject class
public class Subject {
    private List<IObserver> observers = new List<IObserver>();

    public void AddObserver(IObserver observer) {
        observers.Add(observer);
    }

    public void RemoveObserver(IObserver observer) {
        observers.Remove(observer);
    }

    public void NotifyObservers(string message) {
        foreach (var observer in observers) {
            observer.UpdateObserver(message);
        }
    }
}

// Example of usage
public class ObserverExample : MonoBehaviour {
    private void Start() {
        Subject subject = new Subject();

        ConcreteObserver observer1 = new ConcreteObserver("Observer 1");
        ConcreteObserver observer2 = new ConcreteObserver("Observer 2");

        subject.AddObserver(observer1);
        subject.AddObserver(observer2);

        // Notify all observers
        subject.NotifyObservers("Hello Observers!");
    }
}

```

