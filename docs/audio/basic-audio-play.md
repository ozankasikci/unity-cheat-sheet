# Basic Audio Play

```csharp
public class PlayAudio : MonoBehaviour {
    public AudioSource audioSource;

    void Start() {
        // Calling Play on an Audio Source that is already playing will make it start from the beginning
        audioSource.Play();
    }
}
```

