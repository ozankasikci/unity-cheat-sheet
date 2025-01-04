---
sidebar_position: 3
---

# Slider

```csharp
// Slider is used for selecting a value within a range.
// Attach this script to a Slider component to respond to value changes.

using UnityEngine.UI;

Slider mySlider = GetComponent<Slider>();
mySlider.onValueChanged.AddListener(MySliderValueChangedHandler);

void MySliderValueChangedHandler(float value) {
    Debug.Log("Slider Value: " + value);
}
```
