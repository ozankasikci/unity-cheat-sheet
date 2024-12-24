using UnityEngine;

namespace UnityCheatSheet.Patterns.StatePattern
{
    public class StateMachine : MonoBehaviour
    {
        private IState currentState;

        private void Start()
        {
            // Start with the first state in your sequence
            ChangeState(new States.MovementTutorialState(this));
        }

        private void Update()
        {
            if (currentState != null)
            {
                currentState.Update();
            }
        }

        public void ChangeState(IState newState)
        {
            if (currentState != null)
            {
                currentState.Exit();
            }

            currentState = newState;
            currentState.Enter();
        }
    }
} 