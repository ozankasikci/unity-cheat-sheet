# Get the transform of a body bone

Access a specific humanoid bone (e.g., head, hand, spine) to attach props, aim weapons, or read pose data. Unity’s Humanoid rig exposes these through `Animator.GetBoneTransform` once the avatar is initialized.

## Behaviour

1. Cache the `Animator` reference on start.
2. Query `GetBoneTransform` with the desired `HumanBodyBones` enum value.
3. Validate the result—returns `null` if the avatar isn’t humanoid or the bone is not mapped.
4. Use the bone transform to parent objects, align effects, or sample world position/rotation each frame.

## Example

```csharp
using UnityEngine;

public class AttachToBone : MonoBehaviour
{
    [SerializeField] private Animator animator;
    [SerializeField] private HumanBodyBones bone = HumanBodyBones.RightHand;
    [SerializeField] private Transform objectToAttach;

    private Transform boneTransform;

    private void Awake()
    {
        if (!animator)
        {
            animator = GetComponentInParent<Animator>();
        }

        boneTransform = animator ? animator.GetBoneTransform(bone) : null;

        if (!boneTransform)
        {
            Debug.LogWarning($"Bone {bone} not found on avatar", this);
            enabled = false;
            return;
        }

        objectToAttach.SetParent(boneTransform, worldPositionStays: false);
    }

    private void LateUpdate()
    {
        // Optional: ensure attachment stays aligned if you can't parent directly
        if (!objectToAttach) return;
        objectToAttach.localPosition = Vector3.zero;
        objectToAttach.localRotation = Quaternion.identity;
    }
}
```

### Notes

- Works only with Humanoid avatars; for Generic rigs, expose transforms manually or via animation events.
- Call `GetBoneTransform` after the animator has finished initializing (e.g., in `Awake`/`Start` or later) to avoid null returns.
- Use `LateUpdate` when adjusting attachments so they follow the fully evaluated animation pose.
- Cache bone transforms rather than calling `GetBoneTransform` every frame—it’s inexpensive but avoids unnecessary lookups.
