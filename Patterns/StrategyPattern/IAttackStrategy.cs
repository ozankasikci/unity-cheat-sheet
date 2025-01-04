using UnityEngine;

namespace UnityCheatSheet.Patterns.StrategyPattern
{
    public interface IAttackStrategy
    {
        void Attack(Transform attacker, Transform target);
        float GetDamage();
        float GetRange();
    }
} 