# Strategy Pattern Example

A Unity example demonstrating the Strategy Pattern with a combat system.

## Overview

The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. In this example, we use it to implement different attack strategies that a character can switch between during gameplay.

## Implementation

- [`IAttackStrategy.cs`](IAttackStrategy.cs): Base interface for all attack strategies
- [`Character.cs`](Character.cs): Context class that uses the strategies
- Strategies:
  - [`MeleeAttackStrategy.cs`](Strategies/MeleeAttackStrategy.cs): Close-range attack
  - [`RangedAttackStrategy.cs`](Strategies/RangedAttackStrategy.cs): Long-range attack
  - [`AreaAttackStrategy.cs`](Strategies/AreaAttackStrategy.cs): Area-of-effect attack

## Usage

```csharp
// Add Character component to a GameObject
Character character = gameObject.AddComponent<Character>();

// Switch between different attack strategies
character.SetAttackStrategy(new MeleeAttackStrategy());
character.SetAttackStrategy(new RangedAttackStrategy());
character.SetAttackStrategy(new AreaAttackStrategy());

// Perform attack with current strategy
character.PerformAttack();
```

## Benefits

- Easy to add new attack strategies
- Switch strategies at runtime
- Clean separation of attack algorithms
- Encapsulated attack behavior 