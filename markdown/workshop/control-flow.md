---
title: Control Flow
---

# Control Flow

---

## Control Flow primitives

* `if`
* `match`
* `for`, `while` and `loop` loops

---

## Control Flow with `if`

```rust
fn main() {
    if 1 == 2 {
        println!("unlikely");
    } else {
        println!("expected");
    }
}
```

- Condition needs to result in a `bool`
- Parentheses around the conditional are not necessary 
- Blocks need curly brackets, no shorthand

Note: In JavaScript the reverse is true. The parentheses are required, but the curlies are optional.

---

## Control Flow with `match`

```rust
fn main() {
    let a = 4;
    match a % 3 {
        0 => { println!("divisible by 3") }, // <1>
        _ => { println!("not divisible by 3") }, // <2>
    }
}
```

1. match arm
2. default arm

----

### Control Flow with `match` and `enum`

```rust
enum Direction {
    North(i32),
    East(i32),
    South(i32),
    West(i32),
}

fn going_west(dir: &Direction) -> bool {
    match dir {
        Direction::West(_) => true,
        _ => false
    }
}
```

----

### Match guards

Using `if` in a `match` arm:

```rust
fn main() {
    let sum: Option<u8> = 5_u8.checked_add(5);

    match sum {
        Some(sum) if sum % 2 == 0 => println!("5+5 is even!"),
        _ => println!("5+5 ... isn't even?"),
    }
}
```

<small>Match guards allow further refining of a `match`</small>

----

### Combining matches

You can use the `|` operator to match several values in one arm.

```rust
enum Direction {
    North(u32),
    East(u32),
    South(u32),
    West(u32),
}

fn going_south_or_west(dir: &Direction) -> bool {
    match dir {
        Direction::West(_) | Direction::South(_) => true,
        _ => false,
    }
}
```

---

## Exercise

----

One apple usually costs 2 €, but if you buy more than 40 at once, each apple
only costs 1 €.

Write a function that calculates the price of an order of apples given the
quantity bought.

```rust
// Don't modify this function!
fn main() {
    let price1 = calculate_apple_price(35);
    let price2 = calculate_apple_price(40);
    let price3 = calculate_apple_price(65);

    assert_eq!(price1, 70);
    assert_eq!(price2, 80);
    assert_eq!(price3, 65);
}
```

----

Solution:

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

Alternative with `match`:

```rust
fn calculate_apple_price(quantity: u32) -> u32 {
    match quantity {
        quantity if quantity > 40 => quantity,
        quantity => quantity * 2,
    }
}
```

---

## `Option` and `Result`

Two commonly used built-in enums:

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

* `Option` describes the possible absence of a value
* `Result` describes that an operation might return an error instead

----

### Using `Option`

```rust
fn main() {
    // `will_overflow` will be an `Option<u8>` type
    let will_overflow = 10_u8.checked_add(250);
    match will_overflow {
        Some(sum) => println!("interesting: {}", sum),
        None => eprintln!("addition overflow!"),
    }
}
```

----

### Using `Result`

```rust
use std::fs::File;

fn main() {
    let file_open: Result<File, io::Error> = File::open("Does not exist");

    match file_open {
        Ok(f)  => println!("Success!"),
        Err(e) => println!("Open failed: {:?}", e),
    }
}
```

----

### `if let` conditionals

```rust
fn main() {
    let maybe_arg = std::env::args().nth(2);
    // can't know at compile time how many args are passed to our program
    if let Some(arg) = maybe_arg {
        println!("Got second command line argument: {}", arg);
    }
}
```

<small>`if let` is idiomatic if only one case is of interest.</small>

---

## Loops 🎢

----

### `loop`

`loop` is used for (potentially) infinite loops:

```rust
fn main() {
    let mut i = 0;

    loop {
        if i >= 100 {
            break;
        }

        i += 1;
    }
}
```

<small>`break` is used to exit the loop</small>

----

### `while`

`while` is used for conditional loops:

```rust
fn main() {
    let mut i = 0;

    while i < 100 {
        i += 1;
    }
}
```

---

## `for`

`for` is used for iteration:

```rust
fn main() {
    let numbers = vec![1, 2, 3];
    
    // `for item in iterable` creates an iterator by calling
    // `iterable.into_iter()` and keeps calling
    // `next() -> Option<Item>` on it until it receives `None`
    
    for num in numbers {
        println!("{}", num);
    }
}
```

----

### `break` and `continue`

Terminate current iteration or entire loop, using optional labels, if not referring to innermost loop:

```rust
'outer: for i in 0..10 {
    loop {
        loop {
            if i < 5 {
                continue 'outer;
            } else {
                break 'outer;
            }
        }
    }
}
```

---

## Quiz

----

What are `Option` and `Result` used for?

Answer: `Option` for things that may or may not exist. `Result` for the result of operations that might fail.
<!-- .element: class="fragment" -->

----

How can you check if a variable is set to a certain enum variant?

Answer: By using pattern matching (`match`)
<!-- .element: class="fragment" -->

---

## Exercise

----

We will build a very basic logging utility.

```rust
pub enum LogLevel {
    Info,
    Warning,
    Error,
}
```

Build a `log()` function that prints:

```text
[<LEVEL>]: <message>
```

```rust
log(LogLevel::Error, "Stack overflow")
// Prints "[ERROR]: Stack overflow"
```

<small>The type of the `message` argument should be `&str`.</small>

----

Solution:

```rust
fn log(level: LogLevel, message: &str) {
    let level = match level {
        LogLevel::Info => "INFO",
        LogLevel::Warning => "WARNING",
        LogLevel::Error => "ERROR",
    };
    println!("[{}]: {}", level, message);
}
```

---

[Table of Contents](./README.md#/0/1)
