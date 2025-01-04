---
sidebar_position: 2
---

# Check if object is on the ground


```csharp
RaycastHit hit;

// Unlike this example, most of the time you should pass a layerMask as the last option to hit only to the ground
if (Physics.Raycast(transform.position, -Vector3.up, out hit, 0.5f)) {
   Debug.log("Hit something below!");
}
```
