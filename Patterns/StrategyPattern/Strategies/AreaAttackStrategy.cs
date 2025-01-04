using UnityEngine;

namespace UnityCheatSheet.Patterns.StrategyPattern.Strategies
{
    public class AreaAttackStrategy : IAttackStrategy
    {
        private readonly float damage = 10f;
        private readonly float range = 5f;

        public void Attack(Transform attacker, Transform target)
        {
            Debug.Log($"Performing area attack at {attacker.position} with radius {range}!");
            Debug.Log($"All enemies within range take {damage} damage!");
        }

        public float GetDamage() => damage;
        public float GetRange() => range;
    }
} 