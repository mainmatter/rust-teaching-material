---
title: Testing
---

# Testing

---

Testing is a fundamental part of Rust.

Unit, integration, and documentation tests all come builtin.

---

## Organizing Tests

Tests typically end up in 1 of 3 possible locations:

- **Unit test:** In a `tests` submodule
- **Documentation test:** In documentation comments
- **Integration test:** In the `tests/` directory

---

## Unit Tests

```rust
enum Direction { North, South, East, West }

fn is_north(dir: Direction) -> bool {
    match dir {
        Direction::North => true,
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::{is_north, Direction}; // <- imports needed

    #[test]
    fn is_north_works() {
        assert!(is_north(Direction::North) == true);
        assert!(is_north(Direction::South) == false);
    }
}
```

----

Tests can be compiled and run by  
calling `cargo test`:

```text
$ cargo test
running 1 test
test is_north_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured
```

---

## Assertions

- `assert!(condition)` asserts that `condition` is `true`
- `assert_eq!(left, right)` asserts that `left` and `right` are equal to each other
- `assert_ne!(left, right)` asserts that `left` and `right` are **not** equal to each other

----

The [claim](https://docs.rs/claim/latest/claim/index.html) library provides us with more assertion macros:

```rust
let maybe = Some(42);
assert_some_eq!(maybe, 42);

let foo = 'f';
assert_matches!(foo, 'A'..='Z' | 'a'..='z');
```

---

## Exercise

Write a few unit tests for the following function:

```rust
pub fn is_even(num: i32) -> bool {
    num % 2 == 0
}
```

----

```rust
#[cfg(test)]
mod tests {
    use super::is_even;

    #[test]
    fn is_even_works_for_even() {
        assert_eq!(is_even(0), true);
        assert_eq!(is_even(2), true);
        assert_eq!(is_even(42), true);
        assert_eq!(is_even(1000000), true);
        assert_eq!(is_even(-6), true);
    }

    #[test]
    fn is_even_works_for_odd() {
        assert_eq!(is_even(1), false);
        assert_eq!(is_even(-1), false);
        assert_eq!(is_even(13), false);
        assert_eq!(is_even(1234567), false);
    }
}
```

---

## Documentation Tests

- Allows testing public functionality.
- Are displayed in `rustdoc` output.
- For demonstrating expected use cases and examples.

----

### Example

```rust
/// The `Direction` enum describes one of the four
/// main celestial directions.
///
/// ```
/// use example::Direction;
/// let way_home = Direction::North;
/// assert_ne!(Direction::North, Direction::West);
/// ```
pub enum Direction { North, South, East, West }
```

----

```text
$ cargo test
running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured

   Doc-tests example

running 1 test
test Direction_0 ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured
```

---

## Integration Tests

- Tests as if the crate is an external dependency.
- Only has access to public API
- Intended for longer or full-function tests.

----

### Example

```rust
// /tests/basic.rs

use example::{is_north, Direction};

#[test]
fn is_north_works() {
    assert!(is_north(Direction::North) == true);
    assert!(is_north(Direction::South) == false);
}
```

----

## Integration Tests

```text
$ cargo test
running 1 test
test is_north_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured

     Running target/debug/deps/example-9f39afa5d2a1c6bf

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured

   Doc-tests example

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured
```
---

## Exercises

----

Document and test the following function:

```rust
fn calculate_apple_price(quantity: u32) -> u32 {
    if quantity > 40 {
        quantity
    } else {
        quantity * 2
    }
}
```

----

Use `cargo new --lib is_even_library` to create a new library project.

```rust
// src/lib.rs

pub fn is_even(num: i32) -> bool {
    num % 2 == 0
}
```

Write **integration** tests for this function.

---

[Table of Contents](./README.md#/0/2)
