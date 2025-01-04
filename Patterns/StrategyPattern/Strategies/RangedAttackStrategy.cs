using UnityEngine;

namespace UnityCheatSheet.Patterns.StrategyPattern.Strategies
{
    public class RangedAttackStrategy : IAttackStrategy
    {
        private readonly float damage = 15f;
        private readonly float range = 10f;

        public void Attack(Transform attacker, Transform target)
        {
            if (Vector3.Distance(attacker.position, target.position) <= range)
            {
                Vector3 direction = (target.position - attacker.position).normalized;
                Debug.Log($"Firing projectile in direction {direction} for {damage} damage!");
            }
            else
            {
                Debug.Log("Target is out of range for ranged attack");
            }
        }

        public float GetDamage() => damage;
        public float GetRange() => range;
    }
} 