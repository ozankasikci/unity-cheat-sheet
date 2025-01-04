using UnityEngine;
using UnityCheatSheet.Patterns.StrategyPattern.Strategies;

namespace UnityCheatSheet.Patterns.StrategyPattern
{
    public class Character : MonoBehaviour
    {
        private IAttackStrategy attackStrategy;
        public Transform target;

        private void Start()
        {
            // Default to melee attack
            SetAttackStrategy(new MeleeAttackStrategy());
        }

        public void SetAttackStrategy(IAttackStrategy strategy)
        {
            attackStrategy = strategy;
            Debug.Log($"Changed to {strategy.GetType().Name} - Range: {strategy.GetRange()}, Damage: {strategy.GetDamage()}");
        }

        public void PerformAttack()
        {
            if (attackStrategy != null && target != null)
            {
                attackStrategy.Attack(transform, target);
            }
            else
            {
                Debug.LogWarning("Cannot attack: Missing strategy or target");
            }
        }
    }
} 