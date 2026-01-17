# Unity Rigidbody - Physics Component Guide

Rigidbodies give GameObjects mass, gravity, and collision response within Unity's 3D physics engine. They are the backbone of any simulation where forces, impulses, and realistic motion matter—from falling props to fully simulated characters. Understanding how to configure and drive them keeps gameplay responsive and stable.

## Adding a Rigidbody

1. Select the GameObject with a collider and choose `Add Component > Rigidbody`.
2. Unity immediately promotes the collider to a **dynamic** body: it becomes influenced by gravity and other forces.
3. Configure mass, drag, and collision detection in the Inspector before entering play mode to avoid unexpected snaps.

Common setup tips:
- Use **uniform scale** (1,1,1) on physics objects; non-uniform scale can lead to unstable collisions.
- Pair MeshColliders with convex meshes when the object needs to be dynamic; non-convex mesh colliders are static-only.

## Key Properties

- **Mass** – affects inertia and impulse response. Absolute units are arbitrary; focus on relative values (e.g., a crate at 20 vs. player at 60). For stability keep mass between 0.1 and 10 unless you have a reason to deviate.
- **Drag / Angular Drag** – slow linear/angular velocity each physics step. High drag acts like air resistance; leave at default unless you need heavy damping.
- **Use Gravity** – toggles the global gravity vector. Disable for floating objects or custom gravity systems.
- **Is Kinematic** – when true, physics forces no longer affect the body. You drive motion manually (via `MovePosition`, `MoveRotation`, or transforms) but collisions still generate trigger messages.
- **Interpolate** – smooths visible motion between physics ticks. `Interpolate` for moving bodies seen by the player, `Extrapolate` rarely needed, `None` for static visuals.
- **Collision Detection** – choose `Discrete` for slow bodies, `Continuous` for fast-moving colliders, and `Continuous Dynamic` for hitscan-critical objects (bullets). Continuous options cost more but prevent tunnelling.
- **Constraints** – lock position/rotation axes to prevent sliding or tipping.

## Moving Rigidbodies

Physics runs in fixed time steps. Apply forces inside `FixedUpdate` so inputs align with the simulation.

```csharp
using UnityEngine;

public class ForceMover : MonoBehaviour
{
    [SerializeField] private float thrust = 5f;
    private Rigidbody body;

    private void Awake() => body = GetComponent<Rigidbody>();

    private void FixedUpdate()
    {
        var input = new Vector3(Input.GetAxisRaw("Horizontal"), 0f, Input.GetAxisRaw("Vertical"));
        var force = transform.TransformDirection(input.normalized) * thrust;
        body.AddForce(force, ForceMode.Acceleration);
    }
}
```

Movement options:
- **Forces & Torques** – `AddForce`, `AddTorque`, `AddExplosionForce`. Use `ForceMode.Acceleration` for mass-independent control, `Impulse` for instant pushes.
- **Velocity changes** – set `body.velocity`/`angularVelocity` for immediate adjustments; useful for custom controllers.
- **Position/Rotation** – `MovePosition` and `MoveRotation` respect collision detection while targeting a specific transform. Works well for kinematic bodies driven by animation.

## Simulation Modes

Unity categorises physics bodies as:
- **Dynamic** – default Rigidbody. Responds to forces, collisions, and gravity.
- **Kinematic** – Rigidbody with `Is Kinematic` enabled. Ignores forces; you drive its transform explicitly. Collisions act like triggers unless you move it with `MovePosition/MoveRotation` each FixedUpdate.
- **Static** – Collider without a Rigidbody. Does not move; the physics engine treats it as immovable world geometry.

Switching between modes at runtime is valid, but do it sparingly to avoid physics hiccups (e.g., toggle kinematic during grabbing).

## Sleeping and Activation

To save CPU, physics bodies “sleep” when velocity stays near zero. When asleep they ignore forces until disturbed.

- `Rigidbody.IsSleeping()` / `Rigidbody.WakeUp()` let you check or wake manually.
- Calling `AddForce` automatically wakes a sleeping body.
- Disable `sleeping` only if your project needs constant simulation; otherwise keep the default behaviour for performance.

## Collision Tuning

- Match collider types to behaviour: `BoxCollider` for crates, `CapsuleCollider` for characters, `SphereCollider` for fast checks. Complex shapes use `MeshCollider` (convex for dynamic, non-convex for static).
- Configure **Physics Materials** to tweak friction and bounciness. High friction + locked rotation prevents sliding platforms.
- Use **layer-based collision matrix** (`Edit > Project Settings > Physics`) to disable unnecessary collisions early.
- Monitor **contact offset** (default 0.01). Lower values increase precision but may cause jitter.

## Rigidbody vs Rigidbody2D

Unity maintains separate 3D and 2D physics engines. If you work on 2D projects:

- Replace the component with `Rigidbody2D` and pair it with 2D colliders.
- API calls mirror 3D names (`AddForce`, `velocity`, etc.) but live in `UnityEngine`.Physics2D.
- 2D uses Box2D under the hood; expect different tuning defaults (gravity, drag, mass range).

## Debugging & Profiling

- Toggle **Gizmos** and enable colliders in the Scene view to inspect Rigidbody bounds.
- Use the **Physics Debugger** (`Window > Analysis > Physics Debugger`) to visualise contacts, sleeping bodies, and collision events.
- Record with the **Profiler** (`FixedUpdate.Physics`) to catch spikes from excessive rigidbodies or continuous collision on too many objects.
- `Debug.DrawRay`/`DrawLine` helps trace applied forces or expected movement trajectories.

## Best Practices

- Drive physics from `FixedUpdate` and read input in `Update`, then cache values for the next physics step.
- Avoid moving physics bodies via `transform.position = ...` unless the Rigidbody is kinematic.
- Cap velocities (`body.velocity = Vector3.ClampMagnitude(...)`) to prevent tunnelling or unstable simulations.
- Keep Rigidbody counts reasonable; thousands of active bodies per frame can overwhelm the solver.
- Combine complex structures with joints and parent-child hierarchies carefully; freeze unneeded axes to reduce wobble.

## Common Use Cases

- **Character controllers** – physics-driven movement using forces or velocity changes for grounded characters.
- **Vehicle simulation** – wheel colliders interacting with Rigidbody chassis to simulate suspension and traction.
- **Physics props** – crates, debris, dynamic cover reacting to explosions or player pushes.
- **Pickup & throw systems** – toggle `Is Kinematic` when held, re-enable dynamic mode when released.
- **Ragdolls** – multiple rigidbodies connected by joints for realistic death animations or physics-driven scenes.

Mastering Rigidbody configuration unlocks stable, believable motion across your project. Pair them with well-tuned colliders, forces, and joints to build responsive gameplay systems.
