---
title: Error Handling
---

# Error Handling

---

**Error handling is explicit in Rust.**

Any function with known error conditions returns a `Result<T,E>`.

Errors are returned, not thrown or raised, like in other languages.

----

```rust
fn this_can_fail(succeeds: bool) -> Result<String, String> {
    if succeeds {
        Ok(String::from("Success"))
    } else {
        Err(String::from("Error"))
    }
}

fn main() {
    let outcome = this_can_fail(true);
    println!("{}", outcome);
}
```

---

## Exercise

Convert this function to return `Result` instead:

```rust
fn generate_nametag_text(name: String) -> Option<String> {
    if name.len() > 0 {
        Some(format!("Hi! My name is {}", name))
    } else {
        // Empty names aren't allowed.
        None
    }
}
```

----

```rust
fn generate_nametag_text(name: String) -> Result<String, String> {
    if name.len() > 0 {
        Ok(format!("Hi! My name is {}", name))
    } else {
        Err(String::from("Empty names aren't allowed."))
    }
}
```

----

```rust
enum NameTagError {
    EmptyName,
}

fn generate_nametag_text(name: String) -> Result<String, NameTagError> {
    if name.len() > 0 {
        Ok(format!("Hi! My name is {}", name))
    } else {
        Err(NameTagError::EmptyName)
    }
}
```

---

## Results Must Be Used

```rust
fn this_can_fail(succeeds: bool) -> Result<String, String> {
    if succeeds {
        Ok(String::from("Success"))
    } else {
        Err(String::from("Error"))
    }
}

fn main() {
    this_can_fail(true);
}
```

```text
warning: unused `Result` that must be used
  --> src/main.rs:10:5
   |
10 |     this_can_fail(true);
   |     ^^^^^^^^^^^^^^^^^^^^
   |
   = note: `#[warn(unused_must_use)]` on by default
   = note: this `Result` may be an `Err` variant, which should be handled
```

----

### Using Results With `unwrap()`

```rust
fn main() {
    this_can_fail(true).unwrap(); // works
    this_can_fail(false).unwrap(); // boom!
}
```

----

### Using Results With `match`

```rust
fn main() {
    match this_can_fail(false) {
        Ok(val) => println!("Success: {}", val),
        Err(err) => println!("Error: {}", err),
    }
}
```

----

### Using Results With Conditionals

Check for success with `is_ok()`,  
for failure with `is_err()`:

```rust
fn main() {
    let result = this_can_fail(false);
    if result.is_ok() {
        println!("It worked!");
    } else {
        println!("It didn't work!")
    }
}
```

---

## Handling multiple possible failures

----

We can match on the `Err` case and `return Err(...)` when an error is encountered.

```rust
fn multiple_possible_failures() -> Result<String, String> {
    match this_can_fail(true) {
        Err(err) => return Err(err),
        _ => {},
    }
    println!("After 1st potential error.");
    match this_can_fail(false) {
        Err(err) => return Err(err),
        _ => {},
    }
    println!("After 2nd potential error.");
    Ok(String::from("All done."))
}
```

<small>This leads to verbose error handling code and can be simplified...</small>

----

### `?` operator

```rust
fn multiple_possible_failures() -> Result<String, String> {
    this_can_fail(true)?; // <--
    println!("After 1st potential error.");
    this_can_fail(false)?; // <--
    println!("After 2nd potential error.");
    Ok(String::from("All done."))
}
```

<small>This does the exact same thing as the previous example, but in a much more concise way.</small>

----

### Using `?` in `main`

`main` can return either `()` or a `Result<(), ...>`:

```rust
fn main() -> Result<(), String> {
    maybe_dangerous()?;
    Ok(())
}
```

---

## Mapping Result Values

```rust
fn main() {
    let some_result = this_can_fail(true);
    // Only done if `some_result` is an `Ok` Variant.
    let mapped_result = some_result.map(|val| val.len());
    println!("{:?}", mapped_result);
}
```

More methods at https://doc.rust-lang.org/std/result/enum.Result.html

---

## Quiz

Error handling in this function is broken. Why? How can we fix it?

```rust
use std::num::ParseIntError;

pub fn total_cost(item_quantity: &str) -> Result<i32, ParseIntError> {
    let processing_fee = 1;
    let cost_per_item = 5;
    let qty = item_quantity.parse::<i32>();

    Ok(qty * cost_per_item + processing_fee)
}
```

---

## Dynamic errors

----

If our function can fail in multiple ways, but one returns `Err(TypeA)` and the
other `Err(TypeB)`, then what do we return in our function?

```rust
fn fails() -> Result<(), TypeA> { ... }
fn fails_differently() -> Result<(), TypeB> { ... }
fn fails_in_strange_ways() -> Result<(), ???> { ... }
```

----

Solution 1: Custom enum

```rust
enum CustomError {
    ErrorA(TypeA),
    ErrorB(TypeB),
}

fn fails_in_strange_ways() -> Result<(), CustomError> { ... }
```

----

Solution 2: Boxed error

```rust
fn fails_in_strange_ways()
    -> Result<(), Box<dyn std::error::Error>> { ... }
```

<small>This only works if `TypeA` and `TypeB` implement the `std::error::Error` trait.</small>

Note: We haven't mentioned yet what traits are, but we will come to that in a
bit. This pattern works regardless of whether you know the details of what a
trait is.

----

### Recommendations

- https://github.com/dtolnay/thiserror helps a lot with defining custom error enums
- https://github.com/dtolnay/anyhow makes the boxed error pattern much easier to use

---

[Table of Contents](./README.md#/0/1)
