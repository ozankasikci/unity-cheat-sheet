using UnityEngine;

public enum InputState
{
    Gameplay,
    UI,
    Cutscene,
    Dialog
}

// Input data containing all relevant input information
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

// Base input handler
public abstract class InputHandler : MonoBehaviour
{
    protected InputHandler nextHandler;
    protected InputState[] handledStates;
    protected InputState currentState;

    public void SetNextHandler(InputHandler handler)
    {
        nextHandler = handler;
    }

    public virtual bool HandleInput(InputData input)
    {
        if (CanHandleState(currentState))
        {
            ProcessInput(input);
            return true;
        }

        return nextHandler != null && nextHandler.HandleInput(input);
    }

    protected abstract void ProcessInput(InputData input);

    protected bool CanHandleState(InputState state)
    {
        foreach (var handledState in handledStates)
        {
            if (state == handledState) return true;
        }
        return false;
    }

    public void SetState(InputState newState)
    {
        currentState = newState;
    }
}

// Gameplay Input Handler
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

// UI Input Handler
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

// Cutscene Input Handler
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

// Dialog Input Handler
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

// Input Manager
public class InputManager : MonoBehaviour
{
    private GameplayInputHandler gameplayHandler;
    private UIInputHandler uiHandler;
    private CutsceneInputHandler cutsceneHandler;
    private DialogInputHandler dialogHandler;

    private InputState currentState = InputState.Gameplay;

    void Start()
    {
        // Initialize handlers
        gameplayHandler = gameObject.AddComponent<GameplayInputHandler>();
        uiHandler = gameObject.AddComponent<UIInputHandler>();
        cutsceneHandler = gameObject.AddComponent<CutsceneInputHandler>();
        dialogHandler = gameObject.AddComponent<DialogInputHandler>();

        // Set up the chain
        gameplayHandler.SetNextHandler(uiHandler);
        uiHandler.SetNextHandler(cutsceneHandler);
        cutsceneHandler.SetNextHandler(dialogHandler);

        // Set initial state
        SetGameState(InputState.Gameplay);
    }

    void Update()
    {
        // Gather input
        Vector2 movement = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
        bool jumpPressed = Input.GetButtonDown("Jump");
        bool interactPressed = Input.GetButtonDown("Interact");

        // Create input data
        var inputData = new InputData(movement, jumpPressed, interactPressed);

        // Process input through chain
        gameplayHandler.HandleInput(inputData);
    }

    public void SetGameState(InputState newState)
    {
        currentState = newState;
        
        // Update all handlers with new state
        gameplayHandler.SetState(newState);
        uiHandler.SetState(newState);
        cutsceneHandler.SetState(newState);
        dialogHandler.SetState(newState);
    }
}
