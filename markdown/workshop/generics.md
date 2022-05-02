---
title: Generics
---

# Generics

---

## Generic Structs

```rust
struct Point<NumberType> {
    x: NumberType,
    y: NumberType
}

fn main() {
    let point = Point { x: 1_u32, y: 2 }; // <- Point<u32>
    let point: Point<i32> = Point { x: 1, y: 2 };
}
```

Note: Generic parameters are inferred as much as possible.

---

## Generic Enums

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}

enum Option<T> {
    Some(T),
    None,
}
```

----

We can also create custom generic enums:

```rust
enum Either<T, X> {
    Left(T),
    Right(X),
}

fn main() {
    let alternative: Either<i32, f64> = Either::Left(123);
}
```

Note:
- under the hood: the compiler silently copies for all instances of `Either`
  -> the compiler does the boilerplate-ing for you!
- similar-ish to C++ templates

---

## Generic Functions

Functions can have generic type parameters too:

```rust
fn accept_any_type<T>(arg: T) {
    // ...
}

fn accept_and_return_any_type<T, U>(arg: T) -> U {
    // ...
}
```

Note: Without type constraints we can't really do much with the passed in values.

---

###  Generic constraints

`println!("{:?}")` requires `Debug`:

```rust
use std::fmt::Debug;

fn print_everything<T: Debug>(to_print: T) {
    println!("{:?}", to_print);
}

fn print_everything2<T>(to_print: T)
    where T: Debug
{
    println!("{:?}", to_print);
}
```

----

Generic parameters on `struct` can also have constraints:

```rust
struct MyStruct<T: Debug> {
    inner: T
}
```

----

Constraints can also be expressed for implementation blocks:

```rust
trait Distance<T> { /* ... */ }

trait Centered {
    fn center(&self) -> (i32, i32);
}

impl<X, T> Distance<X> for T
    where T: Centered,
          X: Centered {
    // ...
}
```

---

## Negative constraints

**Rust does not allow negative type constraints!**

(Trait A, but *not* Trait B)

----

### Exception: `Sized`

If not specified otherwise, all type parameters carry the constraint `Sized`
(the type has a statically known memory size). This can be suppressed by using
the bound: `?Sized`.

```rust
fn take_unsized<T: ?Sized>(t: &T) {
    //...
}
```

Note: This has ergonomic reasons, as passing types by value is common and requires a known size.

---

## Quiz

----

Make this snippet compile:

```rust
fn main() {
    let mut shopping_list: Vec<?> = Vec::new();
    shopping_list.push("milk");
}
```

Note: There are multiple ways to solve this:

- replace `Vec<?>` with `Vec<&str>`
- replace `Vec<?>` with `Vec<_>`
- remove `Vec<?>` completely

---

## Exercise

```rust
#[derive(Debug)]
struct Wrapper(u32);

impl Wrapper {
    pub fn new(value: u32) -> Self {
        Wrapper(value)
    }
}

fn main() {
    println!("{:?}", Wrapper::new(42));
    println!("{:?}", Wrapper::new("Foo"));
}
```

----

```rust
#[derive(Debug)]
struct Wrapper<T>(T);

impl<T> Wrapper<T> {
    pub fn new(value: T) -> Self {
        Wrapper(value)
    }
}

fn main() {
    println!("{:?}", Wrapper::new(42));
    println!("{:?}", Wrapper::new("Foo"));
}
```

```text
Wrapper(42)
Wrapper("Foo")
```

---

[Table of Contents](./README.md#/0/2)
