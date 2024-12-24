using UnityEngine;

public class UIInputHandler : InputHandler
{
    private void Awake()
    {
        handledStates = new[] { InputState.UI };
    }

    protected override void ProcessInput(InputData input)
    {
        if (input.IsProcessed) return;

        // Handle UI navigation
        if (input.Movement != Vector2.zero)
        {
            Debug.Log("UI Navigation: " + input.Movement);
        }

        // Handle UI selection
        if (input.InteractPressed)
        {
            Debug.Log("UI Selection");
        }

        input.IsProcessed = true;
    }
} 