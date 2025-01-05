# Custom Editor Scripts

```csharp
// Custom Editor scripts allow you to create custom inspectors and windows in the Unity Editor.
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(MyComponent))]
public class MyComponentEditor : Editor {
    public override void OnInspectorGUI() {
        DrawDefaultInspector();

        MyComponent myComponent = (MyComponent)target;
        if (GUILayout.Button("Do Something")) {
            myComponent.DoSomething();
        }
    }
}
```

