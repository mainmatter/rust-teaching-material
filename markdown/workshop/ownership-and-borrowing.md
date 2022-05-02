---
title: Ownership and Borrowing
---

# Ownership and Borrowing

Note:
- stress that this is central to understanding Rust and that we will spend as
  much time on it as needed until everyone feels like they have a grasp on it.

----

Ownership and borrowing are the basis for the memory management and safety
guarantees of Rust.

---

## Rules

-   **Every value has exactly one owner**
-   Ownership can be passed on, both to functions and other types
-   The owner is responsible for removing the data from memory
-   The owner has all powers over the data and can mutate it

Note:
- you can use the metaphor of a physical book: I own it, I can decide to mutate
  it (e.g. by coloring in it or not), I'm responsible for its whereabouts and
  disposal

---

## Example

```rust
use std::fs::File;
use std::io::Write;

fn main() {
    // Try to open a file.
    let file_create = File::create("test");

    // Check the `Result`.
    let mut file = match file_create {
        // Take *ownership* of the file handle.
        Ok(f) => f, // <3>
        Err(e) => panic!("File create failed: {}", e),
    };

    file.write_all(b"Hello World!");
    
    // File handle is automatically destroyed
    // at the end of the function.
}
```

----

### Ownership passing

```rust
use std::fs::File;
use std::io::Write;

fn main() {
    let file_create = File::create("test");

    let file = match file_create {
        Ok(f) => f,
        Err(e) => panic!("File create failed: {}", e),
    };

    // Ownership is passed to the
    // `write_and_close()` function
    write_and_close(file);
}

fn write_and_close(mut file: File) -> std::io::Result<()> {
    file.write_all(b"Hello World!")

    // File handle is automatically destroyed
    // at the end of the function.
}
```

----

What if we call `write_and_close()` twice?

```rust
use std::fs::File;
use std::io::Write;

fn main() {
    let file_create = File::create("test");

    let file = match file_create {
        Ok(f) => f,
        Err(e) => panic!("File create failed: {}", e),
    };

    write_and_close(file);
    write_and_close(file); // <- this will fail to compile
}

fn write_and_close(mut file: File) -> std::io::Result<()> {
    file.write_all(b"Hello World!")
}
```

----

```text
8  |     let file = match file_create {
   |         ---- move occurs because `file` has type `std::fs::File`, which does not implement the `Copy` trait
...
11 |     write_and_close(file);
   |                     ---- value moved here
12 |     write_and_close(file)
   |                     ^^^^ value used here after move
```

---

## Borrowing

----

### Immutable Borrowing

```rust
use std::fs::File;
use std::io::Write;

fn main() {
    let file_create = File::create("test");

    let mut file = match file_create {
        Ok(f) => f,
        Err(e) => panic!("File create failed: {}", e),
    };

    print_filelen(&file);
    file.write_all(b"Hello World!");
    print_filelen(&file);
}

// using `&File` instead of `File` signals that we
// don't take ownership, but only borrow access to the file.
fn print_filelen(f: &File) -> std::io::Result<()> { // <--
    println!("len: {:?}", f.metadata()?.len());
    Ok(())
}
```

----

### Immutable references

`&` signals a so-called "immutable" reference

* Available multiple times
* Always valid (always pointing to living data)
* Never `null`
* Guaranteed to never observe mutation of the pointee

----

### Mutable Borrowing

```rust
use std::fs::File;
use std::io::Write;

fn main() {
    let file_create = File::create("test");

    let mut file = match file_create {
        Ok(f) => f,
        Err(e) => panic!("File create failed: {}", e),
    };

    print_filelen(&file);
    write_to_file(&mut file);
    print_filelen(&file);
}

fn print_filelen(f: &File) -> std::io::Result<()> {
    println!("len: {:?}", f.metadata()?.len());
    Ok(())
}

// using `&mut File` instead of `&File` signals that we
// borrow access to the file in a mutable (read + write) way.
fn write_to_file(f: &mut File) -> std::io::Result<()> {
    f.write_all(b"Hello World!")
}
```

----

### Mutable references

`&mut` signals a so-called "mutable" reference

* Available only once at a time
* Always valid (always pointing to living data)
* Never `null`
* Guaranteed to never alias (no two references point to the same data)

----

### The Borrowing Rules

Values can be:

* Borrowed immutably as often as you'd like
* Or mutably exactly once at a time
* The two rules are mutually exclusive.

Rust forbids _shared mutability_.

---

## Cloning

What if ownership behaviour is getting messy, but we don't want to reference?

We can create a second copy of the data!

----

```rust
#[derive(Debug, Clone)] // <- generate a `.clone()` method
struct Dot {
    x: i32,
    y: i32
}

fn main() {
    let dot = Dot { x: 1, y: 2 };
    pacman(dot.clone()); // <- create a clone of the `dot`
    pacman(dot.clone()); // <- create another clone of `dot`
    pacman(dot); // <- consume the original `dot`
}

fn pacman(dot: Dot) {
    println!("Eating {:?}", dot);
}
```

Note: Explain what `derive(...)` does.

----

### Advice

When starting with Rust, don't be afraid to use `.clone()` as much as you need!

Note: Cloning is slower than using references, but first we need the code to
work correctly, and in most cases cloning will be fast enough.

---

## Copying

```rust
#[derive(Debug, Clone, Copy)] // <- `Copy` derived too
struct Dot {
    x: i32,
    y: i32
}

fn main() {
    let dot = Dot { x: 1, y: 2 };
    pacman(dot); // <- no `.clone()` call needed anymore
    pacman(dot);
}

fn pacman(dot: Dot) {
    println!("Eating {:?}", dot);
}
```

----

**Warning**: Copy is meant for data that can be quickly copied in memory and
are allowed to be copied (e.g.: not File pointers).

----

Values that implement `Copy` follow the standard ownership rules, but they are
copied when ownership is passed on.

---

## Quiz

----

`drop()` is a stdlib function that destroys  
a value immediately.

What does the implementation look like?

```rust
use std::fs::File;

fn main() {
    let file = File::open("test").unwrap();
    let buffer = read_from(&file);
    drop(file);
    // do something else
}
```

----

The function is completely empty.

```rust
#[inline]
fn drop<T>(_: T) {
    // here be dragons
}
```

<small>It destroys the value by taking over ownership and destroying it at the end of the empty function.</small>

---

## Exercise

```rust
fn main() {
    let data = "Rust is great!".to_string();
    get_char(data);
    string_uppercase(&data);
}

// Should not take ownership
fn get_char(data: String) -> char {
    data.chars().last().unwrap()
}

// Should take ownership
fn string_uppercase(mut data: &String) {
    data = &data.to_uppercase();
    println!("{}", data);
}
```

----

```rust
fn main() {
    let data = "Rust is great!".to_string();
    get_char(&data); // <- add `&`
    string_uppercase(data); // <- remove `&`
}

fn get_char(data: &String) -> char { // <- add `&` 
    data.chars().last().unwrap()
}

fn string_uppercase(mut data: String) { // <- remove `&`
    data = data.to_uppercase(); // <- remove `&` 
    println!("{}", data);
}
```

```text
RUST IS GREAT!
```

---

## Questions?

This part is crucial to understanding the limitations and guarantees that Rust
gives us.

---

[Table of Contents](./README.md#/0/2)
