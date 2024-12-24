using UnityEngine;
using System.Collections;

namespace UnityCheatSheet.Patterns.StatePattern.States
{
    public class MovementTutorialState : IState
    {
        private readonly OnboardingManager manager;
        private bool movementCompleted = false;

        public MovementTutorialState(OnboardingManager manager)
        {
            this.manager = manager;
        }

        public void Enter()
        {
            Debug.Log("Welcome to the movement tutorial! Use WASD or arrow keys to move.");
        }

        public void Update()
        {
            if (Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.UpArrow))
            {
                manager.SetDirectionTried("up", true);
                Debug.Log("Moved up!");
            }
            if (Input.GetKeyDown(KeyCode.S) || Input.GetKeyDown(KeyCode.DownArrow))
            {
                manager.SetDirectionTried("down", true);
                Debug.Log("Moved down!");
            }
            if (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.LeftArrow))
            {
                manager.SetDirectionTried("left", true);
                Debug.Log("Moved left!");
            }
            if (Input.GetKeyDown(KeyCode.D) || Input.GetKeyDown(KeyCode.RightArrow))
            {
                manager.SetDirectionTried("right", true);
                Debug.Log("Moved right!");
            }

            if (manager.HasTriedAllDirections() && !movementCompleted)
            {
                movementCompleted = true;
                Debug.Log("Great job! You've mastered movement.");
                manager.StartCoroutine(TransitionToNextState());
            }
        }

        public void Exit()
        {
            Debug.Log("Movement tutorial completed!");
        }

        private IEnumerator TransitionToNextState()
        {
            yield return new WaitForSeconds(2f);
            manager.ChangeState(new CombatTutorialState(manager));
        }
    }
} 