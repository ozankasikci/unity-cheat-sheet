# IgnoreCollision

```csharp
// Makes the collision detection system ignore all collisions between collider1 and collider2.
public static void IgnoreCollision(Collider collider1, Collider collider2, bool ignore = true);

// Here we're disabling the collision detection between the colliders of ally and bullet objects.
Transform bullet;
Transform ally;
Physics.IgnoreCollision(bullet.GetComponent<Collider>(), ally.GetComponent<Collider>());
```