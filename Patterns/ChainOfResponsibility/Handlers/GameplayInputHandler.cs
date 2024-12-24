using UnityEngine;

public class GameplayInputHandler : InputHandler
{
    private void Awake()
    {
        handledStates = new[] { InputState.Gameplay };
    }

    protected override void ProcessInput(InputData input)
    {
        if (input.IsProcessed) return;

        // Handle movement
        if (input.Movement != Vector2.zero)
        {
            Debug.Log("Movement: " + input.Movement);
        }

        // Handle jump
        if (input.JumpPressed)
        {
            Debug.Log("Jump");
        }

        // Handle interaction
        if (input.InteractPressed)
        {
            Debug.Log("Interact");
        }

        input.IsProcessed = true;
    }
} 