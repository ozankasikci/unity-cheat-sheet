# Singleton

```csharp
// Define singleton class
public class SingletonClass: MonoBehaviour {
    private static SingletonClass instance;

    public static SingletonClass Instance { get { return instance; } }

    private void Awake() {
        if (instance != null && instance != this) {
            Destroy(this.gameObject);
        } else {
            instance = this;
        }
    }

    public void SomeFunction() {
    }
}

// Use it in another class
public class AnotherClass: MonoBehaviour {

    private void Awake() {
       SingletonClass.Instance.SomeFunction();
    }
}
```

