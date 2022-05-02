---
title: Functions
---

# Functions

---

## Declaration

The `fn` keyword declares a new function:

```rust
fn main() {
    println!("Hello, world!");
    another_function();
}

fn another_function() {
    println!("Another function.");
}
```

```text
Hello, world!
Another function.
```

---

## Arguments

Function arguments are declared with `name: type` syntax, similar to the syntax
used with `let` and `const`.

```rust
fn main() {
    another_function(5);
}

fn another_function(x: i32) {
    println!("The value of x is: {}", x);
}
```

<small>Default values for arguments are currently not supported.</small>

---

## Returning

If a function returns something, the return type **must** be declared.

```rust
fn doesnt_return() {
    // TODO
}

fn returns_true() -> bool {
    return true;
}
```

<small>A function can only return a single type. If you want to return different
things, you can use an enum. More on that later.</small>

----

The last statement in a function is automatically returned, if it is
**not followed by a semicolon**:

```rust
fn returns_true() -> bool {
    return true;
}

fn returns_true() -> bool {
    true // this is equivalent
}
```

---

## Exercises

1. Write a function that sums up three `u16` integers.
2. Write a function that takes two `i32`, divides the first by the second, and
   returns the result as a floating-point number.
3. Write a function that returns whether a `u8` number is even.

----

Write a function that sums up three `u16` integers:

```rust
fn sum(a: u16, b: u16, c: u16) -> u16 {
    a + b + c
}

fn main() {
    let result = sum(1, 2, 3);
    println!("{}", result); // -> 6
}
```

----

Write a function that takes two `i32`, divides the first by the second, and
returns the result as a floating-point number.

```rust
fn divide(a: i32, b: i32) -> f64 {
    a as f64 / b as f64
}

fn main() {
    let result = divide(5, 4);
    println!("{}", result); // -> 1.25
}
```

---

Write a function that returns whether a `u8` number is even.

```rust
fn is_even(num: u8) -> bool {
    num % 2 == 0
}

fn main() {
    println!("{}", is_even(0)); // -> true
    println!("{}", is_even(1)); // -> false
    println!("{}", is_even(2)); // -> true
    println!("{}", is_even(13)); // -> false
    println!("{}", is_even(42)); // -> true
}
```

---

[Table of Contents](./README.md#/0/1)
