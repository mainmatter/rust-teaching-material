---
title: impl
---

# `impl`

----

Rust offers the possibility to bind functions to types.

----

## Example

```rust
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn new(x: i32, y: i32) -> Point {
        Point { x: x, y: y }
    }
}

fn main() {
    let point = Point::new(1, 2);
}
```

Note: Explain the `impl` block here and the invocation syntax (`Point::new()`).

----

In Rust, a `new()` function is the conventional way to implement a constructor
for a custom `struct`.

----

A `struct` can have multiple constructors:

```rust
impl Point {
    fn new(x: i32, y: i32) -> Point {
        Point { x: x, y: y }
    }

    fn from_pair(pair: (i32, i32)) -> Point {
        Point::new(pair.0, pair.1)
    }
}

fn main() {
    let pair = (1, 2);
    let point = Point::from_pair(pair);
}
```

<small>All functions in an `impl` block must have different names!</small>

Note: You can't have a function with the same name, but different arguments!

---

## Methods

----

We can create methods by adding `&self` as the first argument:

```rust
impl Point {
    fn x(&self) -> &i32 {
        &self.x
    }

    fn y(&self) -> &i32 {
        &self.y
    }
}

fn main() {
    let point = Point::new(1, 2);
    println!("x: {}, y: {}", point.x(), point.y());
}
```

<small>This is essentially the same as in Python.</small>

----

`&self` means that we get an immutable reference to the `struct` for which
this method is implemented.

----

We can also create methods with a mutable reference by using `&mut self`:

```rust
impl Point {
    fn x(&self) -> &i32 {
        &self.x
    }

    fn set_x(&mut self, x: i32) {
        self.x = x;
    }
}

fn main() {
    let mut point = Point::new(1, 2); // <- `mut` required
    point.set_x(42);
    println!("x: {}", point.x());
}
```

----

### Consuming methods

We can also create methods that take ownership by using `self`:

```rust
impl Point {
    fn into_pair(self) -> (i32, i32) {
        (self.x, self.y)
    }
}

fn main() {
    let point = Point::new(1, 2);
    let pair = point.into_pair();
    // `point` is no longer accessible at this point
    // because it was consumed by the `.into_pair()` call.
}
```

Note: Rust convention is to prefix consuming methods with `into_`.

----

| Owned | Borrowed | Mutably borrowed |
|-------|----------|------------------|
| self  | &self    | &mut self        |

---

## `Self`

In an `impl Point` block, `Self` is the same as `Point`:

```rust
impl Point {
    fn new(x: i32, y: i32) -> Point {
        Point { x: x, y: y }
    }

    fn new_with_self(x: i32, y: i32) -> Self {
        Self { x: x, y: y }
    }
}
```

<small>`Self` is the type, `self` is the instance.</small>

---

## Warning

This is **not object-oriented programming**!

Things like subclassing `structs` or overloading methods don't exist in Rust.

---

## Exercise

Implement a `body_mass_index()` method for the `Person` struct:

```rust
struct Person {
    mass: u32, // in kilograms
    height: f64, // in meters
}

fn main() {
    let p = Person { mass: 90, height: 1.8 };
    println!("{:.1}", p.body_mass_index());
}
```

<small>The formula is: `mass / (height^2)`</small>

----

```rust
impl Person {
    fn body_mass_index(&self) -> f64 {
        self.mass as f64 / (self.height * self.height)
    }
}
```

```text
27.8
```

----

```rust
impl Person {
    fn body_mass_index(&self) -> f64 {
        self.mass as f64 / self.height.powi(2)
    }
}
```

```text
27.8
```

----

Implement setter methods for both properties:

```rust
fn main() {
    let mut p = Person { mass: 90, height: 1.8 };
    println!("{:.1}", p.body_mass_index());

    p.set_height(2.1);
    println!("{:.1}", p.body_mass_index());

    p.set_mass(110);
    println!("{:.1}", p.body_mass_index());
}
```

----

```rust
impl Person {
    fn body_mass_index(&self) -> f64 {
        self.mass as f64 / (self.height * self.height)
    }
    
    fn set_height(&mut self, height: f64) {
        self.height = height;
    }
    
    fn set_mass(&mut self, mass: u32) {
        self.mass = mass;
    }
}
```

```text
27.8
20.4
24.9
```

---

[Table of Contents](./README.md#/0/2)
