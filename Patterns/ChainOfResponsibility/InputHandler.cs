using UnityEngine;

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