using UnityEngine;

public class InputData
{
    public Vector2 Movement { get; private set; }
    public bool JumpPressed { get; private set; }
    public bool InteractPressed { get; private set; }
    public bool IsProcessed { get; set; }

    public InputData(Vector2 movement, bool jumpPressed, bool interactPressed)
    {
        Movement = movement;
        JumpPressed = jumpPressed;
        InteractPressed = interactPressed;
        IsProcessed = false;
    }
} 