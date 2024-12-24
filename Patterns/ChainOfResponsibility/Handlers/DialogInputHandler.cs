using UnityEngine;

public class DialogInputHandler : InputHandler
{
    private void Awake()
    {
        handledStates = new[] { InputState.Dialog };
    }

    protected override void ProcessInput(InputData input)
    {
        if (input.IsProcessed) return;

        // Handle dialog choices
        if (input.Movement != Vector2.zero)
        {
            Debug.Log("Dialog Choice: " + input.Movement);
        }

        // Handle advancing dialog
        if (input.InteractPressed)
        {
            Debug.Log("Advance Dialog");
        }

        input.IsProcessed = true;
    }
} 