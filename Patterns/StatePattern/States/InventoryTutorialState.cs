using UnityEngine;
using System.Collections;

namespace UnityCheatSheet.Patterns.StatePattern.States
{
    public class InventoryTutorialState : IState
    {
        private readonly OnboardingManager manager;
        private bool inventoryOpened = false;
        private bool itemSelected = false;

        public InventoryTutorialState(OnboardingManager manager)
        {
            this.manager = manager;
        }

        public void Enter()
        {
            Debug.Log("Let's learn about inventory management! Press 'I' to open inventory.");
        }

        public void Update()
        {
            if (Input.GetKeyDown(KeyCode.I))
            {
                inventoryOpened = true;
                Debug.Log("Inventory opened! Try selecting the Health Potion.");
            }

            // Simulated item selection (press Space to simulate selecting the item)
            if (inventoryOpened && Input.GetKeyDown(KeyCode.Space))
            {
                itemSelected = true;
                Debug.Log("Perfect! You've completed the basic tutorials!");
                manager.StartCoroutine(CompleteOnboarding());
            }
        }

        public void Exit()
        {
            Debug.Log("Inventory tutorial completed!");
        }

        private IEnumerator CompleteOnboarding()
        {
            yield return new WaitForSeconds(3f);
            manager.CompleteOnboarding();
        }
    }
} 