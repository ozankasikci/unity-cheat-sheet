using UnityEngine;

namespace UnityCheatSheet.Patterns.StrategyPattern.Strategies
{
    public class MeleeAttackStrategy : IAttackStrategy
    {
        private readonly float damage = 20f;
        private readonly float range = 2f;

        public void Attack(Transform attacker, Transform target)
        {
            if (Vector3.Distance(attacker.position, target.position) <= range)
            {
                Debug.Log($"Performing melee attack for {damage} damage!");
            }
            else
            {
                Debug.Log("Target is too far for melee attack");
            }
        }

        public float GetDamage() => damage;
        public float GetRange() => range;
    }
} 