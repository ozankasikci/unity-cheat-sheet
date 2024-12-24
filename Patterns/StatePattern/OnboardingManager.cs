using UnityEngine;
using System.Collections.Generic;
using System.Linq;

namespace UnityCheatSheet.Patterns.StatePattern
{
    public class OnboardingManager : MonoBehaviour
    {
        private StateMachine stateMachine;
        private Dictionary<string, bool> directionsTriedMap = new Dictionary<string, bool>();
        private bool onboardingComplete = false;

        private void Start()
        {
            InitializeDirectionsMap();
            stateMachine = gameObject.AddComponent<StateMachine>();
        }

        private void InitializeDirectionsMap()
        {
            directionsTriedMap["up"] = false;
            directionsTriedMap["down"] = false;
            directionsTriedMap["left"] = false;
            directionsTriedMap["right"] = false;
        }

        public void SetDirectionTried(string direction, bool tried)
        {
            if (directionsTriedMap.ContainsKey(direction))
            {
                directionsTriedMap[direction] = tried;
            }
        }

        public bool HasTriedAllDirections()
        {
            return directionsTriedMap.All(kvp => kvp.Value);
        }

        public void CompleteOnboarding()
        {
            onboardingComplete = true;
            Debug.Log("Onboarding completed! The player is ready to start the game.");
        }
    }
} 