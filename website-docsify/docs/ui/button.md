# Button

```csharp
// Button is used to handle user clicks and interactions.
// Attach this script to a Button component to respond to button clicks.

using UnityEngine.UI;

Button myButton = GetComponent<Button>();
myButton.onClick.AddListener(MyButtonClickHandler);

void MyButtonClickHandler() {
    Debug.Log("Button Clicked!");
}
```