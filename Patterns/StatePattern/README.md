# State Pattern Example: Onboarding System

A Unity example demonstrating the State Pattern with a game onboarding/tutorial system. The pattern allows an object to alter its behavior when its internal state changes, making it appear as if the object's class has changed.

## Overview

The State Pattern manages different states of the onboarding process, where each state:
- Has its own behavior and logic
- Knows about its successor state
- Controls the transition to the next state
- Maintains clean separation between different states

## Implementation

- `IState`: Base interface for all states
- `StateMachine`: Manages state transitions and updates
- Tutorial States:
  - `MovementTutorialState`: Teaches WASD/Arrow key movement
  - `CombatTutorialState`: Teaches attack/block mechanics
  - `InventoryTutorialState`: Teaches inventory management
- `OnboardingManager`: Handles onboarding-specific functionality

## Usage

1. Create an empty GameObject and add both components:
```csharp
// The OnboardingManager will automatically add the StateMachine
OnboardingManager manager = gameObject.AddComponent<OnboardingManager>();
```

2. States transition automatically as player completes each phase:
- Movement Tutorial → Combat Tutorial → Inventory Tutorial

3. Manual state changes if needed:
```csharp
StateMachine stateMachine = GetComponent<StateMachine>();
stateMachine.ChangeState(new MovementTutorialState(manager));
```

## Benefits

- **Encapsulation**: Each state encapsulates its own behavior
- **Single Responsibility**: Each state handles only its specific logic
- **Open/Closed**: Easy to add new states without modifying existing ones
- **Clean Transitions**: States manage their own transitions
- **Maintainable**: State logic is isolated and easy to modify
``` 