using UnityEngine;
using System.Collections;

namespace UnityCheatSheet.Patterns.StatePattern.States
{
    public class CombatTutorialState : IState
    {
        private readonly OnboardingManager manager;
        private bool attackPerformed = false;
        private bool blockPerformed = false;

        public CombatTutorialState(OnboardingManager manager)
        {
            this.manager = manager;
        }

        public void Enter()
        {
            Debug.Log("Welcome to combat training! Press Left Mouse Button to attack, Right Mouse Button to block.");
        }

        public void Update()
        {
            if (Input.GetMouseButtonDown(0) && !attackPerformed)
            {
                attackPerformed = true;
                Debug.Log("Excellent attack!");
            }

            if (Input.GetMouseButtonDown(1) && !blockPerformed)
            {
                blockPerformed = true;
                Debug.Log("Perfect block!");
            }

            if (attackPerformed && blockPerformed)
            {
                manager.StartCoroutine(TransitionToNextState());
            }
        }

        public void Exit()
        {
            Debug.Log("Combat tutorial completed!");
        }

        private IEnumerator TransitionToNextState()
        {
            yield return new WaitForSeconds(2f);
            manager.ChangeState(new InventoryTutorialState(manager));
        }
    }
} 