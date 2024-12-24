# Unity Cheat Sheet

## Table of Contents

- [Basics](#basics)
  - [MonoBehaviour](#monobehaviour)
  - [Transform](#transform)
  - [Vector3](#vector3)
  - [Quaternion](#quaternion)
  - [Euler Angles](#euler-angles)
- [Movement & Rotation](#movement--rotation)
  - [Move Object](#move-object)
    - [Transform.Translate()](#transformtranslate)
    - [Vector3.MoveTowards()](#vector3movetowards)
    - [Vector3.Lerp()](#vector3lerp)
    - [Vector3.SmoothDamp()](#vector3smoothdamp)
  - [Rotate Object](#rotate-object)
    - [Transform.rotation](#transformrotation)
    - [Transform.eulerAngles](#transformeulerangles)
    - [Transform.Rotate()](#transformrotate)
    - [Transform.RotateAround()](#transformrotatearound)
    - [Transform.LookAt()](#transformlookat)
    - [Quaternion.LookRotation()](#quaternionlookrotation)
    - [Quaternion.FromToRotation()](#quaternionfromtorotation)
    - [Quaternion.ToAngleAxis()](#quaterniontoangleaxis)
- [Physics](#physics)
  - [Raycast](#raycast)
  - [Ignore Collision](#ignorecollision)
- [Input](#input)
  - [Keyboard](#keyboard)
  - [Mouse](#mouse)
  - [Touch](#touch)
- [UI](#ui)
  - [Button](#button)
  - [Slider](#slider)
- [Audio](#audio)
  - [Basic Audio Play](#basic-audio-play)
- [Scripting](#scripting)
  - [Coroutines](#coroutines)
  - [Event Systems](#event-systems)
  - [Scriptable Objects](#scriptable-objects)
  - [Custom Editor Scripts](#custom-editor-scripts)
  - [Delegates and Events](#delegates-and-events)
- [Design Patterns](#design-patterns)
  - [Singleton](#singleton)
  - [Factory Pattern](#factory-pattern)
  - [Observer Pattern](#observer-pattern)
  - [Command Pattern](#command-pattern)
  - [State Pattern](#state-pattern)
  - [Strategy Pattern](#strategy-pattern)
  - [Object Pooling Pattern](#object-pooling-pattern)
  - [Chain of Responsibility Pattern](#chain-of-responsibility-pattern)
- [Practical Use Cases](#practical-use-cases)
  - [Check if object is on the ground](#check-if-object-is-on-the-ground)
  - [Get the transform of a Body Bone](#get-the-transform-of-a-body-bone)
  - [Make object look at the camera](#make-object-look-at-the-camera)
  - [Load next scene](#load-next-scene)

## Basics

### [MonoBehaviour](https://docs.unity3d.com/ScriptReference/MonoBehaviour.html)
[MonoBehaviour Life Cycle Flow Chart](https://docs.unity3d.com/uploads/Main/monobehaviour_flowchart.svg)
```csharp
// MonoBehaviour is the base class from which every Unity script derives.
// Offers some life cycle functions that are easier for you to develop your game.

// Some of the most frequently used ones are as follows;
Awake()
Start()
Update()
FixedUpdate()
LateUpdate()
OnGUI()
OnEnable()
OnDisable()
```

### [Transform](https://docs.unity3d.com/ScriptReference/Transform.html)
```csharp
// Every object in a Scene has a Transform.
// It's used to store and manipulate the position, rotation and scale of the object.

transform.position.x = 0;
```

### [Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html)
```csharp
// Vector3 is representation of 3D vectors and points
// It's used to represent 3D positions,considering x,y & z axis.

Vector3 v = new Vector3(0f, 0f, 0f);
```

### [Quaternion](https://docs.unity3d.com/ScriptReference/Quaternion.html)
```csharp
// A Quaternion stores the rotation of the Transform in world space.
// Quaternions are based on complex numbers and don't suffer from gimbal lock.
// Unity internally uses Quaternions to represent all rotations.
// You almost never access or modify individual Quaternion components (x,y,z,w); 

// A rotation 30 degrees around the y-axis
Quaternion rotation = Quaternion.Euler(0, 30, 0);
```

### Euler Angles
```csharp
// Euler angles are "degree angles" like 90, 180, 45, 30 degrees.
// Quaternions differ from Euler angles in that they represent a point on a Unit Sphere (the radius is 1 unit).

// Create a quaternion that represents 30 degrees about X, 10 degrees about Y
Quaternion rotation = Quaternion.Euler(30, 10, 0);

// Using a Vector
Vector3 EulerRotation = new Vector3(30, 10, 0);
Quaternion rotation = Quaternion.Euler(EulerRotation);

// Convert a transform's Quaternion angles to Euler angles
Quaternion quaternionAngles = transform.rotation;
Vector3 eulerAngles = quaternionAngles.eulerAngles;
```

## Movement & Rotation

### Move Object
#### Transform.Translate()
```csharp
// Moves the transform in the direction and distance of translation.
public void Translate(Vector3 translation);
public void Translate(Vector3 translation, Space relativeTo = Space.Self);

transform.Translate(Vector3.right * movementSpeed);
```

#### Vector3.MoveTowards()
```csharp
// Calculate a position between the points specified by current and target
// Moving no farther than the distance specified by maxDistanceDelta
public static Vector3 MoveTowards(Vector3 current, Vector3 target, float maxDistanceDelta);

Vector3 targetPosition;
transform.position = Vector3.MoveTowards(transform.position, targetPosition, Time.deltaTime);
```

#### Vector3.Lerp()
```csharp
// Linearly interpolates between two points. Results in a smooth transition.
public static Vector3 Lerp(Vector3 startValue, Vector3 endValue, float interpolationRatio);

Vector3 targetPosition;
float t = 0;
t += Time.deltaTime * speed;
transform.position = Vector3.Lerp(transform.position, targetPosition, t);
```

#### Vector3.SmoothDamp()
```csharp
// Gradually changes a vector towards a desired goal over time.
// The vector is smoothed by some spring-damper like function, which will never overshoot.
// The most common use is for smoothing a follow camera.
public static Vector3 SmoothDamp(Vector3 current, Vector3 target, ref Vector3 currentVelocity, float smoothTime, float maxSpeed = Mathf.Infinity, float deltaTime = Time.deltaTime);

float smoothTime = 1f;
Vector3 velocity;
Vector3 targetPosition = target.TransformPoint(new Vector3(0, 5, -10));
// Smoothly move the camera towards that target position
transform.position = Vector3.SmoothDamp(transform.position, targetPosition, ref velocity, smoothTime);
```

### Rotate Object
#### Transform.rotation
```csharp
// A Quaternion stores the rotation of the Transform in world space.
// Quaternions are based on complex numbers and don't suffer from gimbal lock.
// Unity internally uses Quaternions to represent all rotations.

transform.rotation = new Quaternion(rotx, roty, rotz, rotw);
```

#### Transform.eulerAngles
```csharp
// Transform.eulerAngles represents rotation in world space. 
// It is important to understand that although you are providing X, Y, and Z rotation values to describe your rotation
// those values are not stored in the rotation. Instead, the X, Y & Z values are converted to the Quaternion's internal format.

transform.eulerAngles = Vector3(rotx, roty, rotz);
```

#### Transform.Rotate()
```csharp
// Applies rotation around all the given axes.
public void Rotate(Vector3 eulers, Space relativeTo = Space.Self);
public void Rotate(float xAngle, float yAngle, float zAngle, Space relativeTo = Space.Self);

transform.Rotate(rotx, roty, rotz);
```

#### Transform.RotateAround()
```csharp
// Rotates the transform about axis passing through point in world coordinates by angle degrees.
public void RotateAround(Vector3 point, Vector3 axis, float angle);

// Spin the object around the target at 20 degrees/second.
Transform target;
transform.RotateAround(target.position, Vector3.up, 20 * Time.deltaTime);
```

#### Transform.LookAt()
```csharp
// Points the positive 'Z' (forward) side of an object at a position in world space.
public void LookAt(Transform target);
public void LookAt(Transform target, Vector3 worldUp = Vector3.up);

// Rotate the object's forward vector to point at the target Transform.
Transform target;
transform.LookAt(target);

// Same as above, but setting the worldUp parameter to Vector3.left in this example turns the object on its side.
transform.LookAt(target, Vector3.left);
```

#### Quaternion.LookRotation()
```csharp
// Creates a rotation with the specified forward and upwards directions.
public static Quaternion LookRotation(Vector3 forward, Vector3 upwards = Vector3.up);

// The following code rotates the object towards a target object.
Vector3 direction = target.position - transform.position;
Quaternion rotation = Quaternion.LookRotation(direction);
transform.rotation = rotation;
```

#### Quaternion.FromToRotation()
```csharp
// Creates a rotation (a Quaternion) which rotates from fromDirection to toDirection.
public static Quaternion FromToRotation(Vector3 fromDirection, Vector3 toDirection);

// Sets the rotation so that the transform's y-axis goes along the z-axis.
transform.rotation = Quaternion.FromToRotation(Vector3.up, transform.forward);
```

#### Quaternion.ToAngleAxis()
```csharp
// Converts a rotation to angle-axis representation (angles in degrees).
// In other words, extracts the angle as well as the axis that this quaternion represents.
public void ToAngleAxis(out float angle, out Vector3 axis);

// Extracts the angle - axis rotation from the transform rotation
float angle = 0.0f;
Vector3 axis = Vector3.zero;
transform.rotation.ToAngleAxis(out angle, out axis);
```

## Physics
### Raycast

```csharp
void FixedUpdate() {
    // Bit shift the index of the layer (8) to get a bit mask
    int layerMask = 1 << 8;

    // This would cast rays only against colliders in layer 8.
    // But instead we want to collide against everything except layer 8. The ~ operator does this, it inverts a bitmask.
    layerMask = ~layerMask;

    RaycastHit hit;
    // Does the ray intersect any objects excluding the player layer
    if (Physics.Raycast(transform.position, transform.TransformDirection(Vector3.forward), out hit, Mathf.Infinity, layerMask)) {
        Debug.DrawRay(transform.position, transform.TransformDirection(Vector3.forward) * hit.distance, Color.yellow);
        Debug.Log("Did Hit");
    }
}
```

### IgnoreCollision
```csharp
// Makes the collision detection system ignore all collisions between collider1 and collider2.
public static void IgnoreCollision(Collider collider1, Collider collider2, bool ignore = true);

// Here we're disabling the collision detection between the colliders of ally and bullet objects.
Transform bullet;
Transform ally;
Physics.IgnoreCollision(bullet.GetComponent<Collider>(), ally.GetComponent<Collider>());
```

## Input

### Keyboard

```csharp
// Returns true during the frame the user starts pressing down the key
if (Input.GetKeyDown(KeyCode.Space)) {
    Debug.Log("Space key was pressed");
}

// Jump is also set to space in Input Manager
if (Input.GetButtonDown("Jump")) {
    Debug.Log("Do something");
}
```

### Mouse

```csharp
if (Input.GetAxis("Mouse X") < 0) {
    Debug.Log("Mouse moved left");
}

if (Input.GetAxis("Mouse Y") > 0) {
    Debug.Log("Mouse moved up");
}

if (Input.GetMouseButtonDown(0)) {
    Debug.Log("Pressed primary button.");
}

if (Input.GetMouseButtonDown(1)) {
    Debug.Log("Pressed secondary button.");
}

if (Input.GetMouseButtonDown(2)) {
    Debug.Log("Pressed middle click.");
}
```

### Touch
```csharp
if (Input.touchCount > 0) {
    touch = Input.GetTouch(0);

    if (touch.phase == TouchPhase.Began) {
        Debug.Log("Touch began");
    }

    if (touch.phase == TouchPhase.Moved) {
        Debug.Log("Touch moves");
    }

    if (touch.phase == TouchPhase.Ended) {
        Debug.Log("Touch ended");
    }
}
```

## UI

### Button

```csharp
// Button is used to handle user clicks and interactions.
// Attach this script to a Button component to respond to button clicks.

using UnityEngine.UI;

Button myButton = GetComponent<Button>();
myButton.onClick.AddListener(MyButtonClickHandler);

void MyButtonClickHandler() {
    Debug.Log("Button Clicked!");
}
```

### Slider
```csharp
// Slider is used for selecting a value within a range.
// Attach this script to a Slider component to respond to value changes.

using UnityEngine.UI;

Slider mySlider = GetComponent<Slider>();
mySlider.onValueChanged.AddListener(MySliderValueChangedHandler);

void MySliderValueChangedHandler(float value) {
    Debug.Log("Slider Value: " + value);
}
```

## Audio

### Basic Audio Play

```csharp
public class PlayAudio : MonoBehaviour {
    public AudioSource audioSource;

    void Start() {
        // Calling Play on an Audio Source that is already playing will make it start from the beginning
        audioSource.Play();
    }
}
```

## Scripting

### Coroutines
Coroutines in Unity are a powerful feature that allows you to pause the execution of a function and resume it later. This is particularly useful for tasks that need to be spread over several frames, such as animations, waiting for a condition to be met, or handling asynchronous operations.

#### Basic Coroutine Example
```csharp
using UnityEngine;
using System.Collections;

public class CoroutineExample : MonoBehaviour {
    void Start() {
        // Start the coroutine
        StartCoroutine(ExampleCoroutine());
    }

    IEnumerator ExampleCoroutine() {
        Debug.Log("Coroutine started");

        // Wait for 2 seconds
        yield return new WaitForSeconds(2);

        Debug.Log("Coroutine resumed after 2 seconds");
    }
}
```

#### Using Coroutines for Repeated Actions
Coroutines can be used to perform repeated actions with a delay between each iteration.

```csharp
IEnumerator RepeatActionCoroutine() {
    while (true) {
        Debug.Log("Action performed");
        
        // Wait for 1 second before repeating
        yield return new WaitForSeconds(1);
    }
}

// Start the coroutine
StartCoroutine(RepeatActionCoroutine());
```

#### Waiting for a Condition
Coroutines can also wait for a condition to be true before continuing execution.

```csharp
IEnumerator WaitForConditionCoroutine() {
    Debug.Log("Waiting for condition...");

    // Wait until the condition is met
    yield return new WaitUntil(() => SomeConditionIsTrue());

    Debug.Log("Condition met, resuming coroutine");
}

bool SomeConditionIsTrue() {
    // Replace with your actual condition
    return Time.time > 5;
}

// Start the coroutine
StartCoroutine(WaitForConditionCoroutine());
```

#### Using Coroutines with Unity Events
Coroutines can be used to handle events over time, such as fading out a UI element.

```csharp
IEnumerator FadeOutCoroutine(CanvasGroup canvasGroup, float duration) {
    float startAlpha = canvasGroup.alpha;
    float rate = 1.0f / duration;
    float progress = 0.0f;

    while (progress < 1.0f) {
        canvasGroup.alpha = Mathf.Lerp(startAlpha, 0, progress);
        progress += rate * Time.deltaTime;

        yield return null; // Wait for the next frame
    }

    canvasGroup.alpha = 0;
}

// Usage
CanvasGroup myCanvasGroup = GetComponent<CanvasGroup>();
StartCoroutine(FadeOutCoroutine(myCanvasGroup, 2.0f));
```

#### Stopping Coroutines
You can stop a coroutine using `StopCoroutine()` or `StopAllCoroutines()`.

```csharp
Coroutine myCoroutine;

void Start() {
    myCoroutine = StartCoroutine(ExampleCoroutine());
}

void StopMyCoroutine() {
    if (myCoroutine != null) {
        StopCoroutine(myCoroutine);
    }
}

void StopAllMyCoroutines() {
    StopAllCoroutines();
}
```

#### Important Notes
- Coroutines are not threads. They run on the main thread and are subject to the same performance constraints.
- Use `yield return null;` to wait for the next frame.
- Use `yield return new WaitForSeconds(seconds);` to wait for a specific amount of time.
- Use `yield return new WaitUntil(() => condition);` to wait until a condition is true.
- Coroutines can be nested, and you can yield return other coroutines.

### Event Systems
Unity provides several ways to handle events in your games. Here are the main approaches:

#### UnityEvents
UnityEvents are serializable events that can be configured in the Inspector and used in scripts.

```csharp
using UnityEngine;
using UnityEngine.Events;

// Basic UnityEvent
public class BasicEventExample : MonoBehaviour {
    // This will show up in the inspector
    public UnityEvent onGameStart;
    
    void Start() {
        // Invoke the event
        onGameStart?.Invoke();
    }
}

// UnityEvent with parameters
[System.Serializable]
public class ScoreEvent : UnityEvent<int> { }

public class ParameterizedEventExample : MonoBehaviour {
    public ScoreEvent onScoreChanged;
    private int score = 0;

    public void AddScore(int points) {
        score += points;
        onScoreChanged?.Invoke(score);
    }
}
```

#### C# Events and Delegates
Traditional C# events provide a more code-based approach to event handling.


Delegates are type-safe function pointers, and events are a way to broadcast messages to multiple listeners.

```csharp
public class GameEvents : MonoBehaviour {
    // Delegate definition
    public delegate void GameStateHandler();
    public delegate void ScoreHandler(int newScore);

    // Event declaration
    public static event GameStateHandler OnGameStart;
    public static event GameStateHandler OnGameOver;
    public static event ScoreHandler OnScoreChanged;

    // Methods to trigger events
    public static void TriggerGameStart() {
        OnGameStart?.Invoke();
    }

    public static void TriggerGameOver() {
        OnGameOver?.Invoke();
    }

    public static void TriggerScoreChanged(int newScore) {
        OnScoreChanged?.Invoke(newScore);
    }
}

// Example usage in another class
public class Player : MonoBehaviour {
    void OnEnable() {
        // Subscribe to events
        GameEvents.OnGameStart += HandleGameStart;
        GameEvents.OnGameOver += HandleGameOver;
    }

    void OnDisable() {
        // Unsubscribe from events
        GameEvents.OnGameStart -= HandleGameStart;
        GameEvents.OnGameOver -= HandleGameOver;
    }

    private void HandleGameStart() {
        Debug.Log("Game Started!");
    }

    private void HandleGameOver() {
        Debug.Log("Game Over!");
    }
}
```

### Scriptable Objects
```csharp
// ScriptableObjects are data containers that you can use to save large amounts of data, independent of class instances.
[CreateAssetMenu(fileName = "NewData", menuName = "ScriptableObjects/Data")]
public class Data : ScriptableObject {
    public string dataName;
    public int dataValue;
}

// Usage
Data myData = ScriptableObject.CreateInstance<Data>();
```

### Custom Editor Scripts
```csharp
// Custom Editor scripts allow you to create custom inspectors and windows in the Unity Editor.
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(MyComponent))]
public class MyComponentEditor : Editor {
    public override void OnInspectorGUI() {
        DrawDefaultInspector();

        MyComponent myComponent = (MyComponent)target;
        if (GUILayout.Button("Do Something")) {
            myComponent.DoSomething();
        }
    }
}
```

## Design Patterns
### Singleton

```csharp
// Define singleton class
public class SingletonClass: MonoBehaviour {
    private static SingletonClass instance;

    public static SingletonClass Instance { get { return instance; } }

    private void Awake() {
        if (instance != null && instance != this) {
            Destroy(this.gameObject);
        } else {
            instance = this;
        }
    }

    private void SomeFunction() {
    }
}

// Use it in another class
public class AnotherClass: MonoBehaviour {

    private void Awake() {
       SingletonClass.Instance.SomeFunction();
    }
}
```

### Factory Pattern
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

### Observer Pattern
```csharp
// Observer interface
public interface IObserver {
    void UpdateObserver(string message);
}

// Concrete implementation of the observer
public class ConcreteObserver : IObserver {
    private string name;

    public ConcreteObserver(string name) {
        this.name = name;
    }

    public void UpdateObserver(string message) {
        Debug.Log($"{name} received message: {message}");
    }
}

// Subject class
public class Subject {
    private List<IObserver> observers = new List<IObserver>();

    public void AddObserver(IObserver observer) {
        observers.Add(observer);
    }

    public void RemoveObserver(IObserver observer) {
        observers.Remove(observer);
    }

    public void NotifyObservers(string message) {
        foreach (var observer in observers) {
            observer.UpdateObserver(message);
        }
    }
}

// Example of usage
public class ObserverExample : MonoBehaviour {
    private void Start() {
        Subject subject = new Subject();

        ConcreteObserver observer1 = new ConcreteObserver("Observer 1");
        ConcreteObserver observer2 = new ConcreteObserver("Observer 2");

        subject.AddObserver(observer1);
        subject.AddObserver(observer2);

        // Notify all observers
        subject.NotifyObservers("Hello Observers!");
    }
}

```

### Command Pattern
```csharp
// Command interface
public interface ICommand {
    void Execute();
}

// Concrete command classes
public class MoveCommand : ICommand {
    private Transform transform;
    private Vector3 direction;
    private float distance;

    public MoveCommand(Transform transform, Vector3 direction, float distance) {
        this.transform = transform;
        this.direction = direction;
        this.distance = distance;
    }

    public void Execute() {
        transform.Translate(direction * distance);
    }
}

// Invoker class
public class CommandInvoker {
    private Stack<ICommand> commandStack = new Stack<ICommand>();

    public void ExecuteCommand(ICommand command) {
        commandStack.Push(command);
        command.Execute();
    }

    public void Undo() {
        if (commandStack.Count > 0) {
            var command = commandStack.Pop();
            // Implement an undo method if necessary
        }
    }
}

// Usage
public class CommandUser : MonoBehaviour {
    private CommandInvoker invoker = new CommandInvoker();

    void Update() {
        if (Input.GetKeyDown(KeyCode.UpArrow)) {
            ICommand moveUp = new MoveCommand(transform, Vector3.up, 1.0f);
            invoker.ExecuteCommand(moveUp);
        }

        // Add other directions and invoker.Undo() for undos
    }
}
```

### State Pattern
The State Pattern allows an object to alter its behavior when its internal state changes. It encapsulates state-specific behavior and makes state transitions explicit.

> 📘 **See the detailed example: [State Pattern - Onboarding Example](Patterns/StatePattern/README.md)**  
> A complete example showing how to implement a game onboarding system using the State Pattern.

#### Basic Example
```csharp
// State interface
public interface IState {
    void Enter();
    void Update();
    void Exit();
}

// Example state implementation
public class IdleState : IState {
    public void Enter() => Debug.Log("Entered Idle State");
    public void Update() => Debug.Log("Updating Idle State");
    public void Exit() => Debug.Log("Exited Idle State");
}

// State machine that manages state transitions
public class StateMachine : MonoBehaviour {
    private IState currentState;

    public void ChangeState(IState newState) {
        currentState?.Exit();
        currentState = newState;
        currentState?.Enter();
    }

    private void Update() {
        currentState?.Update();
    }
}
```

### Strategy Pattern
```csharp
// Strategy interface
public interface IAttackStrategy {
    void Attack(Transform attacker, Transform target);
}

// Concrete strategy classes
public class MeleeAttackStrategy : IAttackStrategy {
    public void Attack(Transform attacker, Transform target) {
        float meleeRange = 2f;
        if (Vector3.Distance(attacker.position, target.position) <= meleeRange) {
            Debug.Log("Performing melee attack!");
            // Implement melee attack logic here
        } else {
            Debug.Log("Target is too far for melee attack");
        }
    }
}

public class RangedAttackStrategy : IAttackStrategy {
    public void Attack(Transform attacker, Transform target) {
        Debug.Log("Performing ranged attack!");
        // Implement ranged attack logic here, e.g., instantiate a projectile
    }
}

public class AreaOfEffectAttackStrategy : IAttackStrategy {
    public void Attack(Transform attacker, Transform target) {
        Debug.Log("Performing area of effect attack!");
        // Implement AoE attack logic here, e.g., create an explosion effect
    }
}

// Context class that uses the strategy
public class Character : MonoBehaviour {
    private IAttackStrategy attackStrategy;
    public Transform target;

    public void SetAttackStrategy(IAttackStrategy strategy) {
        attackStrategy = strategy;
    }

    public void PerformAttack() {
        if (attackStrategy != null && target != null) {
            attackStrategy.Attack(transform, target);
        }
    }
}

// Usage example
public class GameManager : MonoBehaviour {
    public Character character;

    private void Start() {
        character.SetAttackStrategy(new MeleeAttackStrategy());
    }

    private void Update() {
        if (Input.GetKeyDown(KeyCode.M)) {
            character.SetAttackStrategy(new MeleeAttackStrategy());
        }
        else if (Input.GetKeyDown(KeyCode.R)) {
            character.SetAttackStrategy(new RangedAttackStrategy());
        }
        else if (Input.GetKeyDown(KeyCode.A)) {
            character.SetAttackStrategy(new AreaOfEffectAttackStrategy());
        }

        if (Input.GetKeyDown(KeyCode.Space)) {
            character.PerformAttack();
        }
    }
}
```

### Object Pooling Pattern
```csharp
using System.Collections.Generic;
using UnityEngine;

public class ObjectPool : MonoBehaviour
{
    [System.Serializable]
    public class Pool
    {
        public string tag;
        public GameObject prefab;
        public int size;
    }

    public List<Pool> pools;
    public Dictionary<string, Queue<GameObject>> poolDictionary;

    private void Start()
    {
        poolDictionary = new Dictionary<string, Queue<GameObject>>();

        foreach (Pool pool in pools)
        {
            Queue<GameObject> objectPool = new Queue<GameObject>();

            for (int i = 0; i < pool.size; i++)
            {
                GameObject obj = Instantiate(pool.prefab);
                obj.SetActive(false);
                objectPool.Enqueue(obj);
            }

            poolDictionary.Add(pool.tag, objectPool);
        }
    }

    public GameObject SpawnFromPool(string tag, Vector3 position, Quaternion rotation)
    {
        if (!poolDictionary.ContainsKey(tag))
        {
            Debug.LogWarning("Pool with tag " + tag + " doesn't exist.");
            return null;
        }

        GameObject objectToSpawn = poolDictionary[tag].Dequeue();

        objectToSpawn.SetActive(true);
        objectToSpawn.transform.position = position;
        objectToSpawn.transform.rotation = rotation;

        poolDictionary[tag].Enqueue(objectToSpawn);

        return objectToSpawn;
    }
}

// Usage example
public class GameManager : MonoBehaviour
{
    public ObjectPool objectPool;

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            objectPool.SpawnFromPool("Bullet", transform.position, Quaternion.identity);
        }
    }
}
```

### Chain of Responsibility Pattern
The Chain of Responsibility pattern creates a chain of handler objects for a request. Each handler contains a reference to the next handler in the chain and decides either to handle the request or pass it to the next handler.

> 📘 **See the detailed example: [Chain of Responsibility - Input Handling Example](Patterns/ChainOfResponsibility/README.md)**  
> A complete example showing how to implement a game input handling system using the Chain of Responsibility Pattern.

#### Basic Example
```csharp
// Handler interface
public interface IHandler {
    void SetNext(IHandler handler);
    void HandleRequest(string request);
}

// Base handler class
public abstract class BaseHandler : IHandler {
    protected IHandler nextHandler;

    public void SetNext(IHandler handler) {
        nextHandler = handler;
    }

    public virtual void HandleRequest(string request) {
        if (nextHandler != null) {
            nextHandler.HandleRequest(request);
        }
    }
}

// Concrete handlers
public class UIHandler : BaseHandler {
    public override void HandleRequest(string request) {
        if (request == "UI_CLICK") {
            Debug.Log("UI Handler: Handling UI click");
        } else {
            base.HandleRequest(request);
        }
    }
}

public class GameplayHandler : BaseHandler {
    public override void HandleRequest(string request) {
        if (request == "PLAYER_MOVE") {
            Debug.Log("Gameplay Handler: Handling player movement");
        } else {
            base.HandleRequest(request);
        }
    }
}

// Usage
public class InputManager : MonoBehaviour {
    private IHandler handlerChain;

    private void Start() {
        // Set up the chain
        var uiHandler = new UIHandler();
        var gameplayHandler = new GameplayHandler();
        
        uiHandler.SetNext(gameplayHandler);
        handlerChain = uiHandler;
    }

    private void Update() {
        // Example: Process different types of input
        if (Input.GetMouseButtonDown(0)) {
            handlerChain.HandleRequest("UI_CLICK");
        }
        if (Input.GetKeyDown(KeyCode.W)) {
            handlerChain.HandleRequest("PLAYER_MOVE");
        }
    }
}
```

## Practical Use Cases

### Check if object is on the ground

```csharp
RaycastHit hit;

// Unlike this example, most of the time you should pass a layerMask as the last option to hit only to the ground
if (Physics.Raycast(transform.position, -Vector3.up, out hit, 0.5f)) {
   Debug.log("Hit something below!");
}
```

### Get the transform of a Body Bone

```csharp
Animator animator;

Transform transform = animator.GetBoneTransform(HumanBodyBones.Head);
```

### Make object look at the camera

```csharp
var camPosition = Camera.main.transform.position;

transform.rotation = Quaternion.LookRotation(transform.position - camPosition);
```

### Load next scene

```csharp
var nextSceneToLoad = SceneManager.GetActiveScene().buildIndex + 1;
var totalSceneCount = SceneManager.sceneCountInBuildSettings;

if (nextSceneToLoad < totalSceneCount) {
  SceneManager.LoadScene(nextSceneToLoad);
}