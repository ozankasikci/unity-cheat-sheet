# Unity Cheat Sheet

A comprehensive guide to Unity development patterns and practices.

## Table of Contents

### Basics

- [MonoBehaviour](basics/monobehaviour.md)
- [Transform](basics/transform.md)
- [Vector3](basics/vector3.md)
- [Quaternion](basics/quaternion.md)
- [Euler Angles](basics/euler-angles.md)

### Movement & Rotation

- [Move Object](movement-rotation/move-object.md)
- [Rotate Object](movement-rotation/rotate-object.md)

### Physics

- [Rigidbody](physics/rigidbody.md)
- [Raycast](physics/raycast.md)
- [Ignore Collision](physics/ignore-collision.md)

### Input

- [Keyboard](input/keyboard.md)
- [Mouse](input/mouse.md)
- [Touch](input/touch.md)

### UI

- [Button](ui/button.md)
- [Slider](ui/slider.md)

### Audio

- [Basic Audio Play](audio/basic-audio-play.md)

### Scripting

- [Coroutines](scripting/coroutines.md)
- [Async/Await](scripting/asyncawait.md)
- [Event Systems](scripting/event-systems.md)
- [Scriptable Objects](scripting/scriptable-objects.md)
- [Custom Editor Scripts](scripting/custom-editor-scripts.md)

### Design Patterns

- [Singleton](design-patterns/singleton.md)
- [Factory Pattern](design-patterns/factory-pattern.md)
- [Observer Pattern](design-patterns/observer-pattern.md)
- [Command Pattern](design-patterns/command-pattern.md)
- [State Pattern](design-patterns/state-pattern.md)
- [Strategy Pattern](design-patterns/strategy-pattern.md)
- [Object Pooling Pattern](design-patterns/object-pooling-pattern.md)
- [Chain of Responsibility Pattern](design-patterns/chain-of-responsibility-pattern.md)

### Shortcuts

- [Scene View Editing](shortcuts/scene-view-editing.md)
- [Scene View Navigation](shortcuts/scene-view-navigation.md)
- [Hierarchy Management](shortcuts/hierarchy-management.md)
- [Layout](shortcuts/layout.md)

### Practical Use Cases

- [Check if object is on the ground](practical-use-cases/check-if-object-is-on-the-ground.md)
- [Get the transform of a Body Bone](practical-use-cases/get-the-transform-of-a-body-bone.md)
- [Make object look at the camera](practical-use-cases/make-object-look-at-the-camera.md)
- [Camera follow & orbit](practical-use-cases/camera-follow-orbit.md)
- [Fade UI element](practical-use-cases/fade-ui-element.md)
- [Load next scene](practical-use-cases/load-next-scene.md)

### TBD (To Be Documented)

- [Input](tbd-to-be-documented/input.md)
- [Scripting](tbd-to-be-documented/scripting.md)

## Practical Use Case Highlights

- [`Check if object is on the ground`](practical-use-cases/check-if-object-is-on-the-ground.md) – Layer-masked raycast grounded check.
- [`Camera follow & orbit`](practical-use-cases/camera-follow-orbit.md) – Smooth follow camera with orbit input.
- [`Fade UI element`](practical-use-cases/fade-ui-element.md) – Coroutine-driven `CanvasGroup` fades.
- [`Make object look at the camera`](practical-use-cases/make-object-look-at-the-camera.md) – Billboard behaviour with optional axis locking.
- [`Load next scene`](practical-use-cases/load-next-scene.md) – Safe next-scene loader with index guard.
- [`Get the transform of a Body Bone`](practical-use-cases/get-the-transform-of-a-body-bone.md) – Attach items to humanoid bones.
