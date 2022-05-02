---
title: Conversions
---

# Conversions

---

## `From` / `Into`

Converting from `&str` to `String`:

```rust
fn main() {
    // provided by `From`
    let string = String::from("string slice"); 
    
    // provided by `Into`
    let string2: String = "string slice".into(); 
}
```

----

`String::from(&str)` is implemented like this:

```rust
impl From<&str> for String {
    /// Converts a `&str` into a [`String`].
    ///
    /// The result is allocated on the heap.
    fn from(s: &str) -> String {
        s.to_owned()
    }
}
```

----

`Into` is implemented for anything that has `From` implemented:

```rust
impl<T, U> Into<U> for T where U: From<T> {
    fn into(self) -> U {
        U::from(self)
    }
}
```

```rust
// T = &str
// U = String

impl Into<String> for &str {
    fn into(self) -> String {
        String::from(self)
    }
}
```
<!-- .element: class="fragment" -->

----

### Exercise

```rust
struct Person {
    first_name: String,
    last_name: String,
}

fn main() {
    let person = Person::new("John", "Doe");
    let name = person.name();
    println!("{name}"); // <- prints "John Doe"

    let name: String = person.into();
    println!("{name}"); // <- prints "John Doe"
}
```

<small>Implement `Person::new()` and `person.name()`, and make `person.into()` work.</small>

----

```rust
impl Person {
    fn new(first_name: &str, last_name: &str) -> Self {
        Self { 
            first_name: first_name.into(),
            last_name: last_name.into(),
        }
    }

    fn name(&self) -> String {
        format!("{} {}", self.first_name, self.last_name)
    }
}

impl From<Person> for String {
    fn from(person: Person) -> String {
        person.name()
    }
}
```

---

## `From` for errors

```rust
use std::io::Write;

enum CustomError {
    FileWriteError(std::io::Error),
    SomeOtherError,
}

// This lets us use `.into()` on any `std::io::Error` to
// automatically convert it to a `CustomError`.
impl From<std::io::Error> for CustomError {
    fn from(error: std::io::Error) -> CustomError {
        CustomError::FileWriteError(error)
    }
}

fn write_to_file(file: &mut std::fs::File) -> Result<(), CustomError> {
    for _ in 0..10 {
        match write!(file, "foo") {
            Ok(_) => {},
            Err(error) => return Err(error.into()), // <--
        }
    }

    Ok(())
}
```

----

### Usage with `?`

We said that `write!(file, "foo")?` means:

```rust
match write!(file, "foo") {
    Ok(value) => value,
    Err(error) => return Err(error),
}
```

It actually means this:
<!-- .element: class="fragment" data-fragment-index="1" -->

```rust
match write!(file, "foo") {
    Ok(value) => value,
    Err(error) => return Err(error.into()), // <--
}
```
<!-- .element: class="fragment" data-fragment-index="1" -->

----

When we use `?`, then error types are automatically converted, if possible and necessary.

---

## `ToString`

The `ToString` trait provides a `.to_string()` method to all types implementing the trait.

----

> This trait is automatically implemented for any type which implements the
> `Display` trait. As such, `ToString` shouldn’t be implemented directly:
> `Display` should be implemented instead, and you get the `ToString`
> implementation for free.

<small>from https://doc.rust-lang.org/std/string/trait.ToString.html</small>

----

### `Display`

```rust
struct Point {
    x: i32,
    y: i32,
}

impl std::fmt::Display for Point {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let point = Point { x: 1, y: 42 };
    println!("{}", point);
}
```

```text
(1, 42)
```

----

Why is `Display` better than `ToString`?

When writing to a file or TCP socket: With `ToString` we first need to allocate
a string, write data into the string, then write the string to the file or socket.
With `Display` we write directly to the file or socket, and only if `ToString` calls
`Display` we will allocate memory.
<!-- .element: class="fragment" -->

----

### Exercise

Implement `Display` for `Person`:

```rust
struct Person {
    first_name: String,
    last_name: String,
}

fn main() {
    let person = Person::new("John", "Doe");
    println!("{person}"); // <- prints "John Doe"
}
```

<small>Bonus task: Change the `name()` method to use the `Display` implementation.</small>

----

```rust
impl std::fmt::Display for Person {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} {}", self.first_name, self.last_name)
    }
}
```

```rust
impl Person {
    fn name(&self) -> String {
        self.to_string()
    }
}
```

---

## `FromStr`

Parse text into something else:

```rust
fn main() {
    let p = Point::from_str("1,2").unwrap();
    println!("{p:?}");
}
```

```text
Point { x: 1, y: 2 }
```

<small>`from_str()` always returns a `Result`!</small>

----

```rust
use std::str::FromStr;
use std::num::ParseIntError;

impl FromStr for Point {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (x, y) = s.split_once(",").unwrap();
        
        let x = x.parse()?;
        let y = y.parse()?;

        Ok(Point { x, y })
    }
}
```

<small>`split_once()` returns an `Option`. We could use a custom error
enum to handle this properly.</small>

----

### Exercise

```rust
fn main() {
    let person: Person = "John Doe".parse().unwrap();
    println!("{person}");
}
```

```text
John Doe
```

----

```rust
use std::str::FromStr;

impl FromStr for Person {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (first_name, last_name) = match s.split_once(" ") {
            Some(value) => value,
            None => return Err("Invalid input name".into()),
        };
        
        Ok(Person::new(first_name, last_name))
    }
}
```

---

[Table of Contents](./README.md#/0/2)
