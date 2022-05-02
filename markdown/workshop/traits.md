---
title: Traits
---

# Traits

----

Traits are roughly like `interface` in Java or TypeScript.

Traits define functions that types must implement.

---

## Custom trait

The `trait` keyword is used to declare new custom traits:

```rust
trait Distance {
    fn distance(&self, other: &Self) -> f64;
}

impl Distance for Point {
    fn distance(&self, other: &Point) -> f64 {
        let dx = other.x - self.x;
        let dy = other.y - self.y;
        ((dx.pow(2) + dy.pow(2)) as f64).sqrt()
    }
}

fn main() {
    let p1 = Point { x: 1, y: 1 };
    let p2 = Point { x: 2, y: 2 };
    println!("{}", p1.distance(&p2));
}
```

----

Traits must be imported in order to **use** their methods!

----

Traits can have default implementations of methods:

```rust
trait Distance {
    fn square_distance(&self, other: &Self) -> f64;
    
    fn distance(&self, other: &Self) -> f64 {
        self.square_distance(other).sqrt()
    }
}
```

<small>`impl` blocks can still decide to override this default implementation
of `distance()`, but `square_distance()` must always be implemented.</small>

---

## Built-in traits

We can also implement built-in traits, or traits from third-party libraries:

```rust
use std::ops::Add;

impl Add for Point {
    type Output = Self;

    fn add(self, other: Self) -> Self::Output {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

fn main() {
    let p1 = Point { x: 1, y: 1 };
    let p2 = Point { x: 2, y: 2 };
    let p3 = p1 + p2; // same as p1.add(p2);
}
```

Note: The `Add` trait is what is called when the `+` operator is used.

---

## Trait rules

You can implement:

- one of your traits on anyone's type
- anyone's trait on one of your types
- but not a foreign trait on a foreign type!

Note: This means we can implement custom traits for all the types in the
standard library, but we can't implement a third-party trait for them.

---

## Exercise

```rust
use std::ops::Mul;

#[derive(Debug, Clone, Copy)]
struct Meters(u32);
#[derive(Debug, Clone, Copy)]
struct SquareMeters(u32);

impl Mul<Meters> for Meters {
    // --- implement me! ---
}

fn main() {
    let a = Meters(5);
    let b = Meters(4);
    let c = a * b;
    println!("{a:?} * {b:?} = {c:?}");
}
```

----

```rust
impl Mul<Meters> for Meters { 
    type Output = SquareMeters;
    
    fn mul(self, other: Meters) -> Self::Output {
        SquareMeters(self.0 * other.0)
    }
}
```

```text
Meters(5) * Meters(4) = SquareMeters(20)
```

----

Can we do the same without the `Copy` trait?

```rust
use std::ops::Mul;

#[derive(Debug, Clone, Copy)] // <--
struct Meters(u32);
#[derive(Debug, Clone, Copy)] // <--
struct SquareMeters(u32);

fn main() {
    let a = Meters(5);
    let b = Meters(4);
    let c = a * b;
    println!("{a:?} * {b:?} = {c:?}");
}
```

----

```rust
use std::ops::Mul;

#[derive(Debug, Clone)]
struct Meters(u32);
#[derive(Debug, Clone)]
struct SquareMeters(u32);

fn main() {
    let a = Meters(5);
    let b = Meters(4);
    let c = a.clone() * b.clone(); // <--
    println!("{a:?} * {b:?} = {c:?}");
}
```

----

Can we do the same without the `Clone` trait?

```rust
use std::ops::Mul;

#[derive(Debug, Clone)] // <--
struct Meters(u32);
#[derive(Debug, Clone)] // <--
struct SquareMeters(u32);

fn main() {
    let a = Meters(5);
    let b = Meters(4);
    let c = a * b;
    println!("{a:?} * {b:?} = {c:?}");
}
```

----

```rust
impl Mul<&Meters> for &Meters { 
    type Output = SquareMeters;
    
    fn mul(self, other: &Meters) -> Self::Output {
        SquareMeters(self.0 * other.0)
    }
}

fn main() {
    let a = Meters(5);
    let b = Meters(4);
    let c = &a * &b;
    println!("{a:?} * {b:?} = {c:?}");
}
```

---

## Derives

`#[derive(...)]` can be used to generate trait implementations automatically:

```rust
#[derive(Eq, PartialEq, Debug)]
struct Point {
    x: i32,
    y: i32,
}
```

<small>This works only for a small number of traits.</small>

----

### `Debug`

`Debug` makes the `{:?}` formatting string work:

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };
    println!("{:?}", p);
}
```

```text
Point { x: 1, y: 2 }
```

Note: This only works if all the fields in the `struct` also have a `Debug` implementation.

----

### `PartialEq` and `Eq` 

`PartialEq` allows us to use `==` comparisons:

```rust
#[derive(PartialEq, Eq)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p1 = Point { x: 1, y: 2 };
    let p2 = Point { x: 1, y: 2 };

    if p1 == p2 {
        println!("The same!");
    }
    
    assert_eq!(p1, p2);
}
```

<small>All fields of `Point` also need to implement `PartialEq`/`Eq` to be able to derive it.</small>

Note: The difference between `Eq` and `PartialEq` is how floating-point numbers
are handled. In particular their handling of `NaN` values.

----

### `Clone` 

`Clone` allows us to create clones of a `struct`:

```rust
#[derive(Clone)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p1 = Point { x: 1, y: 2 };
    let p2 = p1.clone();
    assert_eq!(p1, p2);
}
```

<small>Again, all fields of `Point` also need to implement `Clone` to be able to derive it.</small>

----

### `Default` 

`Default` allows us to create a "default" instance of a `struct`:

```rust
#[derive(Default)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point: Point = Default::default();
    assert_eq!(point.x, 0);
    assert_eq!(point.y, 0);
}
```

----

### `Hash` 

`Hash` is needed to use the `struct` as a key in `HashMap`:

```rust
#[derive(Hash)]
struct Point {
    x: i32,
    y: i32,
}
```

---

## Exercise

```rust
trait Add42 {
    fn add42(self) -> Self;
}

fn main() {
    let x = 42.add42();
    println!("{}", x); // <- should print "84"
}
```

----

```rust
impl Add42 for i32 {
    fn add42(self) -> Self {
        self + 42
    }
}
```

---

## Trait Inheritance

Traits can also request the implementation of other traits and declare default implementations for methods relying on that information.

```rust
trait Named {
    fn name(&self) -> &'static str;
}

trait Person : Named {
    fn home_address(&self) -> Address;
}
```

---

[Table of Contents](./README.md#/0/2)
