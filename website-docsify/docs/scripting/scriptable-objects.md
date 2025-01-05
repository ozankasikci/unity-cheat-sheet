# Scriptable Objects

```csharp
// ScriptableObjects are data containers that you can use to save large amounts of data, independent of class instances.
[CreateAssetMenu(fileName = "NewData", menuName = "ScriptableObjects/Data")]
public class Data : ScriptableObject {
    public string dataName;
    public int dataValue;
}

// Usage
Data myData = ScriptableObject.CreateInstance<Data>();
```

