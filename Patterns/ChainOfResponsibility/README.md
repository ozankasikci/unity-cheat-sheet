# Chain of Responsibility Pattern Example

A Unity example demonstrating the Chain of Responsibility pattern with a game input handling system.

## Overview

The Chain of Responsibility pattern manages input handling across different game states (gameplay, UI, cutscenes, dialog). Each handler processes input based on the current game state, ensuring inputs are handled appropriately in each context.

## Implementation

- `InputData`: Contains all input information (movement, buttons)
- `InputHandler`: Base handler class with chain logic
- Game States:
  - `GameplayInputHandler`: Handles player movement and actions
  - `UIInputHandler`: Handles UI navigation and selection
  - `CutsceneInputHandler`: Handles cutscene controls
  - `DialogInputHandler`: Handles dialog system input
- `InputManager`: Sets up the chain and manages game states

## Usage

```csharp
// Setup is automatic - just add to a GameObject
InputManager manager = gameObject.AddComponent<InputManager>();

// Change states as needed
manager.SetGameState(InputState.Dialog);    // When entering dialog
manager.SetGameState(InputState.Gameplay);  // When returning to gameplay
```

## Benefits

- Clean separation of input handling by game state
- Easy to add new input states and handlers
- Prevents input conflicts between states
- Centralized input management
