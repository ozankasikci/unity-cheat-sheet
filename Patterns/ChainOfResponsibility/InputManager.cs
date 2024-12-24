using UnityEngine;

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