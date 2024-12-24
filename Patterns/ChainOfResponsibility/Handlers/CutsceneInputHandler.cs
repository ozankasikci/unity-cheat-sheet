using UnityEngine;

public class CutsceneInputHandler : InputHandler
{
    private void Awake()
    {
        handledStates = new[] { InputState.Cutscene };
    }

    protected override void ProcessInput(InputData input)
    {
        if (input.IsProcessed) return;

        // Only allow skipping cutscene with interact button
        if (input.InteractPressed)
        {
            Debug.Log("Skip Cutscene");
        }

        input.IsProcessed = true;
    }
} 