# Collisions & Triggers

Unity provides two types of collision detection: **Collisions** (physics-based) and **Triggers** (overlap detection).

## Collision vs Trigger: When to Use Each

| Use Case | Type | Example |
|----------|------|---------|
| Physical interactions | **Collision** | Player hitting a wall, ball bouncing |
| Detecting overlap without physics | **Trigger** | Picking up coins, entering zones |
| Damage on impact | **Collision** | Bullet hitting enemy with knockback |
| Damage without impact | **Trigger** | Walking through lava, laser beam |

## Requirements

For collision/trigger events to fire, you need:

| Requirement | Collision Events | Trigger Events |
|-------------|------------------|----------------|
| Collider on both objects | Yes | Yes |
| Rigidbody on at least one | Yes | Yes |
| "Is Trigger" checked | No | Yes (on at least one) |

---

## 3D Collision Events

Called when colliders physically collide. Objects will bounce/interact based on physics.

### OnCollisionEnter

Called once when collision begins.

```csharp
void OnCollisionEnter(Collision collision)
{
    Debug.Log("Hit: " + collision.gameObject.name);
}
```

### OnCollisionStay

Called every frame while collision continues.

```csharp
void OnCollisionStay(Collision collision)
{
    Debug.Log("Still touching: " + collision.gameObject.name);
}
```

### OnCollisionExit

Called once when collision ends.

```csharp
void OnCollisionExit(Collision collision)
{
    Debug.Log("Stopped touching: " + collision.gameObject.name);
}
```

### Collision Class Properties

The `Collision` parameter provides detailed collision information:

```csharp
void OnCollisionEnter(Collision collision)
{
    // The GameObject we collided with
    GameObject other = collision.gameObject;
    
    // The Rigidbody we collided with (can be null)
    Rigidbody otherRb = collision.rigidbody;
    
    // The Collider we collided with
    Collider otherCollider = collision.collider;
    
    // Relative velocity of the collision
    Vector3 impactVelocity = collision.relativeVelocity;
    float impactForce = impactVelocity.magnitude;
    
    // Total impulse applied during collision
    Vector3 impulse = collision.impulse;
    
    // Number of contact points
    int contactCount = collision.contactCount;
    
    // First contact point
    if (contactCount > 0)
    {
        ContactPoint contact = collision.GetContact(0);
        Vector3 hitPoint = contact.point;
        Vector3 hitNormal = contact.normal;
    }
}
```

### Practical Example: Damage on Impact

```csharp
public class DamageOnCollision : MonoBehaviour
{
    public float damageMultiplier = 10f;
    public float minImpactForce = 5f;

    void OnCollisionEnter(Collision collision)
    {
        float impactForce = collision.relativeVelocity.magnitude;
        
        if (impactForce > minImpactForce)
        {
            float damage = impactForce * damageMultiplier;
            
            // Try to get Health component from collided object
            Health health = collision.gameObject.GetComponent<Health>();
            if (health != null)
            {
                health.TakeDamage(damage);
            }
        }
    }
}
```

---

## 3D Trigger Events

Called when colliders overlap. No physics response occurs - objects pass through each other.

> **Setup:** Check "Is Trigger" on at least one of the colliders in the Inspector.

### OnTriggerEnter

Called once when another collider enters the trigger.

```csharp
void OnTriggerEnter(Collider other)
{
    Debug.Log(other.gameObject.name + " entered trigger");
}
```

### OnTriggerStay

Called every frame while another collider is inside the trigger.

```csharp
void OnTriggerStay(Collider other)
{
    Debug.Log(other.gameObject.name + " is inside trigger");
}
```

### OnTriggerExit

Called once when another collider exits the trigger.

```csharp
void OnTriggerExit(Collider other)
{
    Debug.Log(other.gameObject.name + " exited trigger");
}
```

### Practical Example: Pickup Item

```csharp
public class PickupItem : MonoBehaviour
{
    public int coinValue = 10;
    public AudioClip pickupSound;

    void OnTriggerEnter(Collider other)
    {
        // Only respond to player
        if (other.CompareTag("Player"))
        {
            // Add coins to player
            PlayerScore score = other.GetComponent<PlayerScore>();
            if (score != null)
            {
                score.AddCoins(coinValue);
            }
            
            // Play sound at pickup location
            if (pickupSound != null)
            {
                AudioSource.PlayClipAtPoint(pickupSound, transform.position);
            }
            
            // Destroy pickup
            Destroy(gameObject);
        }
    }
}
```

### Practical Example: Damage Zone

```csharp
public class DamageZone : MonoBehaviour
{
    public float damagePerSecond = 10f;

    void OnTriggerStay(Collider other)
    {
        Health health = other.GetComponent<Health>();
        if (health != null)
        {
            health.TakeDamage(damagePerSecond * Time.deltaTime);
        }
    }
}
```

---

## 2D Collision Events

For 2D games, use the 2D variants with `Collision2D` and `Collider2D` types.

### Collision Events (2D)

```csharp
void OnCollisionEnter2D(Collision2D collision)
{
    Debug.Log("Hit: " + collision.gameObject.name);
    
    // 2D-specific properties
    Vector2 contactPoint = collision.GetContact(0).point;
    Vector2 contactNormal = collision.GetContact(0).normal;
}

void OnCollisionStay2D(Collision2D collision)
{
    Debug.Log("Still touching: " + collision.gameObject.name);
}

void OnCollisionExit2D(Collision2D collision)
{
    Debug.Log("Stopped touching: " + collision.gameObject.name);
}
```

### Trigger Events (2D)

```csharp
void OnTriggerEnter2D(Collider2D other)
{
    Debug.Log(other.gameObject.name + " entered trigger");
}

void OnTriggerStay2D(Collider2D other)
{
    Debug.Log(other.gameObject.name + " is inside trigger");
}

void OnTriggerExit2D(Collider2D other)
{
    Debug.Log(other.gameObject.name + " exited trigger");
}
```

### 2D Platformer Example: Ground Check

```csharp
public class GroundCheck : MonoBehaviour
{
    public bool isGrounded = false;

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Ground"))
        {
            isGrounded = true;
        }
    }

    void OnTriggerExit2D(Collider2D other)
    {
        if (other.CompareTag("Ground"))
        {
            isGrounded = false;
        }
    }
}
```

---

## Common Patterns

### Tag Checking

Filter collisions by tag using `CompareTag()` (faster than `==`):

```csharp
void OnCollisionEnter(Collision collision)
{
    if (collision.gameObject.CompareTag("Enemy"))
    {
        // Handle enemy collision
    }
    else if (collision.gameObject.CompareTag("Pickup"))
    {
        // Handle pickup collision
    }
}
```

### Layer Checking

Filter by layer for more complex scenarios:

```csharp
void OnTriggerEnter(Collider other)
{
    // Check if object is on "Interactable" layer
    if (other.gameObject.layer == LayerMask.NameToLayer("Interactable"))
    {
        // Handle interaction
    }
}
```

### Getting Components

Access components on the collided object:

```csharp
void OnCollisionEnter(Collision collision)
{
    // Try to get a component (returns null if not found)
    Enemy enemy = collision.gameObject.GetComponent<Enemy>();
    if (enemy != null)
    {
        enemy.TakeDamage(10);
    }
    
    // TryGetComponent is slightly more efficient (Unity 2019.2+)
    if (collision.gameObject.TryGetComponent<Enemy>(out Enemy e))
    {
        e.TakeDamage(10);
    }
}
```

### Destroy on Collision

```csharp
void OnCollisionEnter(Collision collision)
{
    if (collision.gameObject.CompareTag("Enemy"))
    {
        // Destroy the enemy
        Destroy(collision.gameObject);
        
        // Destroy this object (e.g., bullet)
        Destroy(gameObject);
    }
}
```

---

## Collision Matrix

Not all collider combinations generate events. Here's a simplified reference:

### Collision Events (OnCollisionEnter, etc.)

| Object A | Object B | Events Fire? |
|----------|----------|--------------|
| Rigidbody | Static Collider | Yes |
| Rigidbody | Rigidbody | Yes |
| Rigidbody | Kinematic Rigidbody | Yes |
| Kinematic | Static Collider | No |
| Kinematic | Kinematic | No |
| Static | Static | No |

### Trigger Events (OnTriggerEnter, etc.)

| Object A | Object B | Events Fire? |
|----------|----------|--------------|
| Rigidbody Trigger | Any Collider | Yes |
| Kinematic Trigger | Any Collider | Yes |
| Static Trigger | Rigidbody/Kinematic | Yes |
| Static Trigger | Static Collider | No |

### Collider Type Reference

| Type | Rigidbody | Is Kinematic | Is Trigger |
|------|-----------|--------------|------------|
| Static Collider | None | - | Off |
| Rigidbody Collider | Yes | Off | Off |
| Kinematic Collider | Yes | On | Off |
| Static Trigger | None | - | On |
| Rigidbody Trigger | Yes | Off | On |
| Kinematic Trigger | Yes | On | On |

---

## Common Mistakes

### 1. Missing Rigidbody

**Problem:** No collision events firing.

**Solution:** At least one object needs a Rigidbody (or Rigidbody2D for 2D).

```csharp
// This script won't receive collision events if neither 
// this object nor the collided object has a Rigidbody
void OnCollisionEnter(Collision collision) { } // Never called!
```

### 2. Both Objects Are Kinematic

**Problem:** Two kinematic rigidbodies don't generate collision events.

**Solution:** Make at least one non-kinematic, or use triggers instead.

### 3. Trigger Not Enabled

**Problem:** `OnTriggerEnter` not being called.

**Solution:** Check "Is Trigger" on at least one collider in the Inspector.

### 4. Wrong 2D/3D Methods

**Problem:** Using `OnCollisionEnter` in a 2D game.

**Solution:** Use `OnCollisionEnter2D` with 2D colliders.

```csharp
// WRONG for 2D games
void OnCollisionEnter(Collision collision) { }

// CORRECT for 2D games  
void OnCollisionEnter2D(Collision2D collision) { }
```

### 5. Layer Collision Matrix

**Problem:** Objects on certain layers don't collide.

**Solution:** Check **Edit > Project Settings > Physics > Layer Collision Matrix**.

### 6. Scale Affecting Colliders

**Problem:** Colliders not matching visual mesh after scaling.

**Solution:** Apply scale in modeling software, or manually adjust collider size.

### 7. Method Signature Wrong

**Problem:** Collision methods not being called.

**Solution:** Ensure exact method signature. Common errors:

```csharp
// WRONG - lowercase 'c'
void onCollisionEnter(Collision collision) { }

// WRONG - missing parameter
void OnCollisionEnter() { }

// WRONG - wrong parameter type
void OnCollisionEnter(Collider other) { } // Should be Collision

// CORRECT
void OnCollisionEnter(Collision collision) { }
```

---

## Quick Reference

### 3D Methods

| Method | Parameter | When Called |
|--------|-----------|-------------|
| `OnCollisionEnter(Collision)` | `Collision` | Collision begins |
| `OnCollisionStay(Collision)` | `Collision` | Every frame during collision |
| `OnCollisionExit(Collision)` | `Collision` | Collision ends |
| `OnTriggerEnter(Collider)` | `Collider` | Enters trigger |
| `OnTriggerStay(Collider)` | `Collider` | Every frame inside trigger |
| `OnTriggerExit(Collider)` | `Collider` | Exits trigger |

### 2D Methods

| Method | Parameter | When Called |
|--------|-----------|-------------|
| `OnCollisionEnter2D(Collision2D)` | `Collision2D` | Collision begins |
| `OnCollisionStay2D(Collision2D)` | `Collision2D` | Every frame during collision |
| `OnCollisionExit2D(Collision2D)` | `Collision2D` | Collision ends |
| `OnTriggerEnter2D(Collider2D)` | `Collider2D` | Enters trigger |
| `OnTriggerStay2D(Collider2D)` | `Collider2D` | Every frame inside trigger |
| `OnTriggerExit2D(Collider2D)` | `Collider2D` | Exits trigger |

---

## See Also

- [Rigidbody](rigidbody.md) - Physics body configuration
- [Raycast](raycast.md) - Ray-based collision detection
- [Ignore Collision](ignore-collision.md) - Disabling specific collisions
