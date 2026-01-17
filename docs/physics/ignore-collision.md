# Unity Ignore Collision - Disable Physics Interactions

Disable collision detection between specific colliders or entire layers.

> For collision/trigger event handling, see [Collisions & Triggers](collisions.md)

## Physics.IgnoreCollision

Ignore collisions between two specific colliders:

```csharp
// Makes the collision detection system ignore all collisions between collider1 and collider2.
public static void IgnoreCollision(Collider collider1, Collider collider2, bool ignore = true);

// Example: Disable collision between ally and bullet
Transform bullet;
Transform ally;
Physics.IgnoreCollision(bullet.GetComponent<Collider>(), ally.GetComponent<Collider>());
```

### Practical Example: Spawned Projectile

```csharp
public class ProjectileSpawner : MonoBehaviour
{
    public GameObject projectilePrefab;

    void Fire()
    {
        GameObject projectile = Instantiate(projectilePrefab, transform.position, transform.rotation);
        
        // Prevent projectile from colliding with the object that spawned it
        Physics.IgnoreCollision(projectile.GetComponent<Collider>(), GetComponent<Collider>());
    }
}
```

## Physics.IgnoreLayerCollision

Ignore collisions between entire layers (more efficient for many objects):

```csharp
// Ignore collisions between layer 8 (e.g., "Player") and layer 9 (e.g., "PlayerProjectiles")
Physics.IgnoreLayerCollision(8, 9, true);

// Using LayerMask for readability
int playerLayer = LayerMask.NameToLayer("Player");
int projectileLayer = LayerMask.NameToLayer("PlayerProjectiles");
Physics.IgnoreLayerCollision(playerLayer, projectileLayer, true);
```

### Restore Collision

```csharp
// Re-enable collision between two colliders
Physics.IgnoreCollision(collider1, collider2, false);

// Re-enable collision between layers
Physics.IgnoreLayerCollision(playerLayer, projectileLayer, false);
```

## Layer Collision Matrix (Editor)

For permanent layer collision settings, use:  
**Edit > Project Settings > Physics > Layer Collision Matrix**

This is more efficient than runtime `IgnoreLayerCollision` calls for static configurations.

## 2D Equivalents

```csharp
// Ignore collision between two 2D colliders
Physics2D.IgnoreCollision(collider2D_1, collider2D_2, true);

// Ignore collision between 2D layers
Physics2D.IgnoreLayerCollision(layer1, layer2, true);
```

## See Also

- [Collisions & Triggers](collisions.md) - Handling collision events
- [Raycast](raycast.md) - Ray-based collision detection

