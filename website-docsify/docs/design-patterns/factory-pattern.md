# Factory Pattern

```csharp
// Interface for the enemy
public interface IEnemy {
    void Attack();
    void TakeDamage(int damage);
}

// Concrete implementation of the enemy: Goblin
public class Goblin : IEnemy {
    public void Attack() => Debug.Log("Goblin attacking!");
    public void TakeDamage(int damage) => Debug.Log($"Goblin taking {damage} damage.");
}

// Concrete implementation of the enemy: Orc
public class Orc : IEnemy {
    public void Attack() => Debug.Log("Orc attacking!");
    public void TakeDamage(int damage) => Debug.Log($"Orc taking {damage} damage.");
}

// Factory interface for creating enemies
public interface IEnemyFactory {
    IEnemy CreateEnemy();
}

// Concrete implementation of the factory: GoblinFactory
public class GoblinFactory : IEnemyFactory {
    public IEnemy CreateEnemy() => new Goblin();
}

// Concrete implementation of the factory: OrcFactory
public class OrcFactory : IEnemyFactory {
    public IEnemy CreateEnemy() => new Orc();
}

// Client class using the factory to create and interact with enemies
public class GameManager : MonoBehaviour {
    private void Start() {
        InteractWithEnemy(new GoblinFactory());
        InteractWithEnemy(new OrcFactory());

        // You can introduce new concrete implementations of IEnemy
        // without modifying existing client code
        // adhering to the open/closed principle of SOLID design 
    }

    private void InteractWithEnemy(IEnemyFactory factory) {
        IEnemy enemy = factory.CreateEnemy();

        // Consistent interaction regardless of the enemy type
        enemy.Attack();
        enemy.TakeDamage(20);
    }
}
```