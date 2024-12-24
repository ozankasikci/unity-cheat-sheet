using UnityEngine;

namespace UnityCheatSheet.Patterns.StatePattern
{
    public interface IState
    {
        void Enter();
        void Update();
        void Exit();
    }
} 