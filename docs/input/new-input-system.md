# New Input System

The Input System package provides a modern, flexible way to handle player input across all platforms. It is the **standard for Unity 6** and recommended for all new projects.

## Legacy vs New Input System

| Feature | Legacy (`UnityEngine.Input`) | New (`UnityEngine.InputSystem`) |
|---------|------------------------------|----------------------------------|
| Multi-device support | Limited | Excellent |
| Runtime rebinding | Manual implementation | Built-in support |
| Action-based input | No | Yes |
| Type safety | String-based | Generated C# classes |
| Unity 6 default | No | Yes |
| Local multiplayer | Complex | Built-in PlayerInputManager |

## Installation & Setup

### Unity 6 Projects
The Input System is installed by default. Verify in **Edit > Project Settings > Player > Active Input Handling** is set to **Input System Package (New)** or **Both**.

### Earlier Unity Versions
```
Window > Package Manager > Unity Registry > Input System > Install
```

After installation, Unity will prompt you to enable the new input backend. Click **Yes** and Unity will restart.

### Required Using Statement
```csharp
using UnityEngine.InputSystem;
```

---

## Direct Device Access

Direct device access lets you read input immediately without setting up Input Actions. Good for prototyping or simple projects.

### Keyboard

```csharp
// Check if key is currently held down
if (Keyboard.current.wKey.isPressed)
{
    // W key is held
}

// Check if key was pressed this frame
if (Keyboard.current.spaceKey.wasPressedThisFrame)
{
    // Space just pressed
}

// Check if key was released this frame
if (Keyboard.current.escapeKey.wasReleasedThisFrame)
{
    // Escape just released
}

// Check if any key is pressed
if (Keyboard.current.anyKey.isPressed)
{
    // Some key is pressed
}
```

### Mouse

```csharp
// Mouse position (screen coordinates)
Vector2 mousePos = Mouse.current.position.ReadValue();

// Mouse movement since last frame
Vector2 mouseDelta = Mouse.current.delta.ReadValue();

// Scroll wheel (y = vertical scroll)
Vector2 scroll = Mouse.current.scroll.ReadValue();
float scrollY = scroll.y;

// Mouse buttons
if (Mouse.current.leftButton.isPressed) { }
if (Mouse.current.leftButton.wasPressedThisFrame) { }
if (Mouse.current.rightButton.wasPressedThisFrame) { }
if (Mouse.current.middleButton.isPressed) { }

// Side buttons
if (Mouse.current.forwardButton.wasPressedThisFrame) { }
if (Mouse.current.backButton.wasPressedThisFrame) { }
```

### Gamepad

```csharp
// Always check if gamepad exists
if (Gamepad.current == null) return;

// Left stick (Vector2, -1 to 1)
Vector2 leftStick = Gamepad.current.leftStick.ReadValue();

// Right stick
Vector2 rightStick = Gamepad.current.rightStick.ReadValue();

// Individual stick axes
float leftX = Gamepad.current.leftStick.x.ReadValue();
float leftY = Gamepad.current.leftStick.y.ReadValue();

// Triggers (0 to 1)
float leftTrigger = Gamepad.current.leftTrigger.ReadValue();
float rightTrigger = Gamepad.current.rightTrigger.ReadValue();

// D-pad as Vector2
Vector2 dpad = Gamepad.current.dpad.ReadValue();

// Face buttons (A/B/X/Y on Xbox, Cross/Circle/Square/Triangle on PlayStation)
if (Gamepad.current.buttonSouth.wasPressedThisFrame) { } // A / Cross
if (Gamepad.current.buttonEast.wasPressedThisFrame) { }  // B / Circle
if (Gamepad.current.buttonWest.wasPressedThisFrame) { }  // X / Square
if (Gamepad.current.buttonNorth.wasPressedThisFrame) { } // Y / Triangle

// Shoulder buttons
if (Gamepad.current.leftShoulder.wasPressedThisFrame) { }  // LB / L1
if (Gamepad.current.rightShoulder.wasPressedThisFrame) { } // RB / R1

// Stick clicks
if (Gamepad.current.leftStickButton.wasPressedThisFrame) { }  // L3
if (Gamepad.current.rightStickButton.wasPressedThisFrame) { } // R3

// Menu buttons
if (Gamepad.current.startButton.wasPressedThisFrame) { }
if (Gamepad.current.selectButton.wasPressedThisFrame) { }
```

### Gamepad Movement Example

```csharp
public class GamepadMovement : MonoBehaviour
{
    public float moveSpeed = 5f;
    public float turnSpeed = 90f;

    void Update()
    {
        if (Gamepad.current == null) return;

        // Movement with left stick
        Vector2 move = Gamepad.current.leftStick.ReadValue();
        transform.Translate(move.x * moveSpeed * Time.deltaTime, 0, move.y * moveSpeed * Time.deltaTime);

        // Rotation with right stick
        Vector2 look = Gamepad.current.rightStick.ReadValue();
        transform.Rotate(0, look.x * turnSpeed * Time.deltaTime, 0);
    }
}
```

### Touch (Touchscreen)

```csharp
if (Touchscreen.current == null) return;

// Primary touch
var touch = Touchscreen.current.primaryTouch;

if (touch.press.isPressed)
{
    Vector2 position = touch.position.ReadValue();
    Vector2 delta = touch.delta.ReadValue();
}

// All touches
foreach (var t in Touchscreen.current.touches)
{
    if (t.press.isPressed)
    {
        Vector2 pos = t.position.ReadValue();
    }
}
```

---

## Input Actions

Input Actions provide a layer of abstraction between your code and physical inputs. This is the **recommended approach** for production games.

### Benefits
- Same code works for keyboard, gamepad, touch
- Players can rebind controls at runtime
- Easier to manage complex input schemes
- Type-safe with generated C# classes

### Creating Input Action Assets

1. **Create Asset**: Right-click in Project > Create > Input Actions
2. **Open Editor**: Double-click the `.inputactions` file
3. **Create Action Map**: e.g., "Gameplay", "UI", "Vehicle"
4. **Add Actions**: e.g., "Move", "Jump", "Fire"
5. **Add Bindings**: Map to keyboard, mouse, gamepad
6. **Generate C# Class**: Check "Generate C# Class" in the asset inspector
7. **Apply**: Click "Apply" to save changes

### Action Types

| Type | Use Case | Example |
|------|----------|---------|
| **Value** | Continuous input | Movement stick, mouse position |
| **Button** | Discrete press/release | Jump, fire, interact |
| **Pass-Through** | All input without processing | Raw device input |

### Composite Bindings

Combine multiple inputs into one value (e.g., WASD to Vector2):

1. Add Action with **Value** type and **Vector2** control type
2. Add binding > **2D Vector Composite**
3. Set Up=W, Down=S, Left=A, Right=D
4. Add another binding for **Gamepad Left Stick**

Now one action handles both WASD and gamepad!

---

## Using Input Actions in Code

### Method 1: PlayerInput Component (Designer-Friendly)

The simplest approach - no code required for basic setup.

1. Add **PlayerInput** component to your GameObject
2. Assign your Input Action Asset
3. Set **Behavior** to "Send Messages" or "Invoke Unity Events"
4. Implement callback methods:

```csharp
public class PlayerController : MonoBehaviour
{
    // Called automatically by PlayerInput component
    void OnMove(InputValue value)
    {
        Vector2 movement = value.Get<Vector2>();
        // Use movement...
    }

    void OnJump(InputValue value)
    {
        // Jump!
    }

    void OnFire(InputValue value)
    {
        // Fire!
    }
}
```

### Method 2: C# Generated Class (Type-Safe)

Best for larger projects. Provides IntelliSense and compile-time checks.

1. Select your `.inputactions` asset
2. In Inspector, check **Generate C# Class**
3. Click **Apply**

```csharp
public class PlayerController : MonoBehaviour
{
    private MyGameControls controls; // Auto-generated class name

    void Awake()
    {
        controls = new MyGameControls();
    }

    void OnEnable()
    {
        controls.Gameplay.Enable();
        
        // Subscribe to events
        controls.Gameplay.Jump.performed += OnJump;
        controls.Gameplay.Fire.performed += OnFire;
    }

    void OnDisable()
    {
        // Always unsubscribe!
        controls.Gameplay.Jump.performed -= OnJump;
        controls.Gameplay.Fire.performed -= OnFire;
        
        controls.Gameplay.Disable();
    }

    void Update()
    {
        // Polling for continuous input
        Vector2 move = controls.Gameplay.Move.ReadValue<Vector2>();
        transform.Translate(move.x * Time.deltaTime, 0, move.y * Time.deltaTime);
    }

    void OnJump(InputAction.CallbackContext context)
    {
        Debug.Log("Jump!");
    }

    void OnFire(InputAction.CallbackContext context)
    {
        Debug.Log("Fire!");
    }
}
```

### Method 3: InputActionReference (Editor-Friendly)

Reference actions directly in the Inspector without generating classes.

```csharp
public class PlayerController : MonoBehaviour
{
    [SerializeField] private InputActionReference moveAction;
    [SerializeField] private InputActionReference jumpAction;
    [SerializeField] private InputActionReference fireAction;

    void OnEnable()
    {
        moveAction.action.Enable();
        jumpAction.action.Enable();
        fireAction.action.Enable();
        
        jumpAction.action.performed += OnJump;
    }

    void OnDisable()
    {
        jumpAction.action.performed -= OnJump;
        
        moveAction.action.Disable();
        jumpAction.action.Disable();
        fireAction.action.Disable();
    }

    void Update()
    {
        Vector2 move = moveAction.action.ReadValue<Vector2>();
        // Use move...
    }

    void OnJump(InputAction.CallbackContext context)
    {
        Debug.Log("Jump!");
    }
}
```

---

## Callbacks vs Polling

### Callback-Based (Event-Driven)

Best for: Discrete actions like jump, fire, interact.

```csharp
void OnEnable()
{
    jumpAction.performed += OnJump;
    jumpAction.started += OnJumpStart;    // Button pressed
    jumpAction.canceled += OnJumpCancel;  // Button released
}

void OnJump(InputAction.CallbackContext context)
{
    // Fires once when action is performed
    Jump();
}

void OnJumpStart(InputAction.CallbackContext context)
{
    // Button just pressed - start charging jump
    StartCharging();
}

void OnJumpCancel(InputAction.CallbackContext context)
{
    // Button released - release charged jump
    ReleaseCharge();
}
```

### Polling-Based (Check Every Frame)

Best for: Continuous input like movement, camera rotation.

```csharp
void Update()
{
    // Read current value
    Vector2 move = moveAction.ReadValue<Vector2>();
    
    // Check if triggered this frame
    if (jumpAction.triggered)
    {
        Jump();
    }
    
    // Check specific frame states
    if (fireAction.WasPressedThisFrame())
    {
        StartFiring();
    }
    
    if (fireAction.WasReleasedThisFrame())
    {
        StopFiring();
    }
}
```

### Update vs FixedUpdate

```csharp
private bool jumpRequested;

void Update()
{
    // Read input in Update for responsiveness
    if (jumpAction.WasPressedThisFrame())
    {
        jumpRequested = true;
    }
    
    // Camera rotation - do in Update
    Vector2 look = lookAction.ReadValue<Vector2>();
    transform.Rotate(0, look.x * sensitivity * Time.deltaTime, 0);
}

void FixedUpdate()
{
    // Apply physics in FixedUpdate
    Vector2 move = moveAction.ReadValue<Vector2>();
    rb.AddForce(new Vector3(move.x, 0, move.y) * moveForce);
    
    if (jumpRequested)
    {
        rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
        jumpRequested = false;
    }
}
```

---

## Practical Examples

### Complete Player Movement

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerMovement : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private InputActionReference moveAction;
    [SerializeField] private InputActionReference jumpAction;
    [SerializeField] private InputActionReference sprintAction;
    
    [Header("Settings")]
    [SerializeField] private float walkSpeed = 5f;
    [SerializeField] private float sprintSpeed = 10f;
    [SerializeField] private float jumpForce = 5f;
    
    private Rigidbody rb;
    private bool isGrounded;
    private bool jumpRequested;

    void Awake()
    {
        rb = GetComponent<Rigidbody>();
    }

    void OnEnable()
    {
        moveAction.action.Enable();
        jumpAction.action.Enable();
        sprintAction.action.Enable();
        
        jumpAction.action.performed += OnJump;
    }

    void OnDisable()
    {
        jumpAction.action.performed -= OnJump;
        
        moveAction.action.Disable();
        jumpAction.action.Disable();
        sprintAction.action.Disable();
    }

    void OnJump(InputAction.CallbackContext context)
    {
        if (isGrounded)
        {
            jumpRequested = true;
        }
    }

    void FixedUpdate()
    {
        // Movement
        Vector2 input = moveAction.action.ReadValue<Vector2>();
        float speed = sprintAction.action.IsPressed() ? sprintSpeed : walkSpeed;
        
        Vector3 move = new Vector3(input.x, 0, input.y) * speed;
        rb.velocity = new Vector3(move.x, rb.velocity.y, move.z);
        
        // Jump
        if (jumpRequested)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            jumpRequested = false;
        }
    }

    void OnCollisionStay(Collision collision)
    {
        isGrounded = true;
    }

    void OnCollisionExit(Collision collision)
    {
        isGrounded = false;
    }
}
```

### Mouse Look (First/Third Person Camera)

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class MouseLook : MonoBehaviour
{
    [SerializeField] private InputActionReference lookAction;
    [SerializeField] private float sensitivity = 0.1f;
    [SerializeField] private float maxPitch = 85f;
    
    [SerializeField] private Transform playerBody; // For horizontal rotation
    
    private float pitch = 0f;

    void OnEnable()
    {
        lookAction.action.Enable();
        Cursor.lockState = CursorLockMode.Locked;
    }

    void OnDisable()
    {
        lookAction.action.Disable();
        Cursor.lockState = CursorLockMode.None;
    }

    void Update()
    {
        Vector2 look = lookAction.action.ReadValue<Vector2>();
        
        // Horizontal rotation (rotate player body)
        playerBody.Rotate(Vector3.up * look.x * sensitivity);
        
        // Vertical rotation (rotate camera)
        pitch -= look.y * sensitivity;
        pitch = Mathf.Clamp(pitch, -maxPitch, maxPitch);
        transform.localRotation = Quaternion.Euler(pitch, 0, 0);
    }
}
```

### Hold and Release (Charge Attack)

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class ChargeAttack : MonoBehaviour
{
    [SerializeField] private InputActionReference chargeAction;
    [SerializeField] private float maxChargeTime = 2f;
    
    private float chargeTime;
    private bool isCharging;

    void OnEnable()
    {
        chargeAction.action.Enable();
        chargeAction.action.started += OnChargeStart;
        chargeAction.action.canceled += OnChargeRelease;
    }

    void OnDisable()
    {
        chargeAction.action.started -= OnChargeStart;
        chargeAction.action.canceled -= OnChargeRelease;
        chargeAction.action.Disable();
    }

    void OnChargeStart(InputAction.CallbackContext context)
    {
        isCharging = true;
        chargeTime = 0f;
    }

    void OnChargeRelease(InputAction.CallbackContext context)
    {
        if (isCharging)
        {
            float chargePercent = Mathf.Clamp01(chargeTime / maxChargeTime);
            Fire(chargePercent);
            isCharging = false;
        }
    }

    void Update()
    {
        if (isCharging)
        {
            chargeTime += Time.deltaTime;
            // Show charge UI...
        }
    }

    void Fire(float power)
    {
        Debug.Log($"Fired with {power * 100}% power!");
    }
}
```

---

## Runtime Rebinding

Allow players to customize their controls at runtime.

### Display Current Binding

```csharp
using UnityEngine;
using UnityEngine.InputSystem;
using TMPro;

public class BindingDisplay : MonoBehaviour
{
    [SerializeField] private InputActionReference action;
    [SerializeField] private TMP_Text bindingText;
    [SerializeField] private int bindingIndex = 0; // 0 for first binding

    void Start()
    {
        UpdateDisplay();
    }

    void UpdateDisplay()
    {
        bindingText.text = action.action.GetBindingDisplayString(bindingIndex);
    }
}
```

### Interactive Rebinding

```csharp
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.UI;
using TMPro;

public class RebindUI : MonoBehaviour
{
    [SerializeField] private InputActionReference actionToRebind;
    [SerializeField] private int bindingIndex = 0;
    [SerializeField] private Button rebindButton;
    [SerializeField] private TMP_Text bindingText;
    [SerializeField] private GameObject waitingOverlay;

    private InputActionRebindingExtensions.RebindingOperation rebindOperation;

    void Start()
    {
        rebindButton.onClick.AddListener(StartRebinding);
        UpdateBindingDisplay();
    }

    void StartRebinding()
    {
        // Disable action during rebind
        actionToRebind.action.Disable();
        
        rebindButton.interactable = false;
        waitingOverlay.SetActive(true);

        rebindOperation = actionToRebind.action.PerformInteractiveRebinding(bindingIndex)
            .WithControlsExcluding("<Mouse>/position")
            .WithControlsExcluding("<Mouse>/delta")
            .WithCancelingThrough("<Keyboard>/escape")
            .OnComplete(operation => RebindComplete())
            .OnCancel(operation => RebindCanceled())
            .Start();
    }

    void RebindComplete()
    {
        rebindOperation.Dispose();
        rebindOperation = null;

        rebindButton.interactable = true;
        waitingOverlay.SetActive(false);
        
        actionToRebind.action.Enable();
        UpdateBindingDisplay();
    }

    void RebindCanceled()
    {
        rebindOperation.Dispose();
        rebindOperation = null;

        rebindButton.interactable = true;
        waitingOverlay.SetActive(false);
        
        actionToRebind.action.Enable();
    }

    void UpdateBindingDisplay()
    {
        bindingText.text = actionToRebind.action.GetBindingDisplayString(bindingIndex);
    }

    void OnDestroy()
    {
        rebindOperation?.Dispose();
    }
}
```

### Save and Load Bindings

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class BindingSaveLoad : MonoBehaviour
{
    [SerializeField] private InputActionAsset inputActions;
    
    private const string BINDINGS_KEY = "InputBindings";

    public void SaveBindings()
    {
        string json = inputActions.SaveBindingOverridesAsJson();
        PlayerPrefs.SetString(BINDINGS_KEY, json);
        PlayerPrefs.Save();
    }

    public void LoadBindings()
    {
        if (PlayerPrefs.HasKey(BINDINGS_KEY))
        {
            string json = PlayerPrefs.GetString(BINDINGS_KEY);
            inputActions.LoadBindingOverridesFromJson(json);
        }
    }

    public void ResetToDefaults()
    {
        inputActions.RemoveAllBindingOverrides();
        PlayerPrefs.DeleteKey(BINDINGS_KEY);
    }

    void Awake()
    {
        LoadBindings();
    }
}
```

---

## Best Practices

### 1. Always Enable/Disable Actions
```csharp
void OnEnable()
{
    myAction.action.Enable();
}

void OnDisable()
{
    myAction.action.Disable();
}
```

### 2. Always Unsubscribe from Callbacks
```csharp
void OnEnable()
{
    jumpAction.performed += OnJump;
}

void OnDisable()
{
    jumpAction.performed -= OnJump; // Prevents memory leaks!
}
```

### 3. Check Device Availability
```csharp
void Update()
{
    if (Gamepad.current == null) return; // No gamepad connected
    
    Vector2 stick = Gamepad.current.leftStick.ReadValue();
}
```

### 4. Use Action Maps for Game States
```csharp
void EnterMenu()
{
    controls.Gameplay.Disable();
    controls.UI.Enable();
}

void ExitMenu()
{
    controls.UI.Disable();
    controls.Gameplay.Enable();
}
```

### 5. Cache InputActionReference Values
```csharp
// Good - cache the action
private InputAction cachedMoveAction;

void Awake()
{
    cachedMoveAction = moveActionRef.action;
}

void Update()
{
    Vector2 move = cachedMoveAction.ReadValue<Vector2>();
}
```

---

## Quick Reference

### Device Access
```csharp
Keyboard.current      // Current keyboard
Mouse.current         // Current mouse
Gamepad.current       // First connected gamepad
Gamepad.all[0]        // Specific gamepad by index
Touchscreen.current   // Current touchscreen
```

### Button States
```csharp
button.isPressed              // Currently held down
button.wasPressedThisFrame    // Just pressed this frame
button.wasReleasedThisFrame   // Just released this frame
```

### Action States
```csharp
action.triggered              // Performed this frame
action.WasPressedThisFrame()  // Started this frame
action.WasReleasedThisFrame() // Canceled this frame
action.ReadValue<T>()         // Current value
action.IsPressed()            // Currently active
```

### Enable/Disable Hierarchy
```csharp
action.Enable() / action.Disable()        // Single action
actionMap.Enable() / actionMap.Disable()  // Action map
asset.Enable() / asset.Disable()          // Entire asset
```

### Callbacks
```csharp
action.started += ctx => { };   // Input began
action.performed += ctx => { }; // Input performed (main event)
action.canceled += ctx => { };  // Input ended
```

---

## Common Gotchas

1. **Actions Must Be Enabled**: Actions don't work until you call `.Enable()`
2. **Disable in OnDisable**: Prevents stray input events and memory leaks
3. **Unsubscribe Callbacks**: Always unsubscribe in `OnDisable` or `OnDestroy`
4. **Null Device Checks**: `Gamepad.current` is null when no gamepad is connected
5. **Generated Class Names**: The generated class uses your `.inputactions` filename
6. **Binding Index**: When rebinding, use the correct binding index (0 = first binding)
7. **Physics Input**: Read input in `Update`, apply physics in `FixedUpdate`
