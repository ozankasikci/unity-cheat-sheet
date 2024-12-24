# State Pattern Example

A Unity example demonstrating the State Pattern with a game onboarding system.

## Overview

The State Pattern allows an object to alter its behavior when its internal state changes. In this example, we use it to manage different states of a game onboarding system, where each state represents a different tutorial phase.

## Implementation

- [`IState.cs`](IState.cs): Base interface for all states
- [`StateMachine.cs`](StateMachine.cs): Manages state transitions
- [`OnboardingManager.cs`](OnboardingManager.cs): Handles onboarding logic
- States:
  - [`MovementTutorialState.cs`](States/MovementTutorialState.cs): Teaches basic movement
  - [`CombatTutorialState.cs`](States/CombatTutorialState.cs): Teaches combat mechanics
  - [`InventoryTutorialState.cs`](States/InventoryTutorialState.cs): Teaches inventory usage

## Usage

```csharp
// Setup is automatic - just add to a GameObject
OnboardingManager manager = gameObject.AddComponent<OnboardingManager>();

// States will transition automatically as player completes each tutorial phase
// You can also manually transition if needed:
manager.ChangeState(new CombatTutorialState());
```

## Benefits

- Clean separation of tutorial phases
- Easy to add new tutorial states
- Clear state transitions
- Centralized tutorial management
``` 