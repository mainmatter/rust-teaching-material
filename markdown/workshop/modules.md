---
title: Modules
---

# Modules

---

## Imports

All used items must be imported:

```rust
use std::fs::File;

fn main() {
    let f = File::open("test");
}
```

<small>Similar to Java, Python or JavaScript.</small>

----

### Prelude

One exception to the rule is the "Prelude": This is a special module in the
standard library that is automatically imported.

```rust
use std::prelude::v1::*;
```

----

The prelude contains things like:

- `Copy` and `Clone`
- `drop()`
- `ToOwned`
- `Option` and `Result`
- `String`
- `Vec`

see https://doc.rust-lang.org/std/prelude/

----

### Other Preludes

Other libraries offer `prelude`-Modules, one of the most common is `std::io`:

```rust
use std::io::prelude::*;
use std::fs::File;

fn main() {
    let mut f = File::open("foo.txt").unwrap();
    let mut buffer = [0; 10];

    f.read(&mut buffer).unwrap();

    println!("The bytes: {:?}", buffer);
}
```

<small>The non-`std::prelude` ones need to be imported explicitly.</small>

----

### Glob Imports

Glob imports allow us to import *everything* from a module:

```rust
use std::fs::*;

fn main() {
    let f = File::open("test");
}
```

<small>Aside from prelude modules, this is generally discouraged.</small>

----

### Module Imports

It is possible to import the module instead and qualify every use:

```rust
use std::fs;

fn main() {
    let f = fs::File::open("test");
}
```

----

### Structured imports

You can combine multiple things, that are also nested:

```rust
use std::{fs::File, io::{Read, Write}};

fn main() {
    let mut buffer = [0; 10];

    let mut f1 = File::open("foo.txt").unwrap();
    f1.read(&mut buffer).unwrap();

    let mut f2 = File::create("bar.txt").unwrap();
    f2.write_all(&buffer).unwrap();
}
```

Note: While nesting is possible, it is rarely used in practice.

----

### Renaming imports

The `as` keyword can be used to rename things that are imported:

```rust
use std::fs as file_system;

fn main() {
    let f = file_system::File::open("test");
}
```

----

### Local imports

Imports can happen inside a function. They only take effect within the function.

```rust
fn main() {
    use std::fs::File;

    let f = File::open("test");
}
```

---

## Modules

[//]: # (----)

[//]: # ()
[//]: # (- `src/lib.rs`: the root module of a library)

[//]: # (- `src/main.rs`: the root module of a single application)

[//]: # (- `src/bin/*.rs`: the root modules for multiple applications)

----

### Inline modules

```rust
fn main() {
    workload::work();
}

// `mod workload { ... }` declares an inline module
mod workload {
    
    // `pub` specifies that the function is public API
    // and can be used outside the `workload` module itself.
    pub fn work() {
        println!("hard at work!");
    }
}
```

----

### File-based modules

```rust
// ---- main.rs ----

// `mod workload;` declares a file-based module
mod workload;

fn main() {
    workload::work();
}
```

```rust
// ---- workload.rs ----

pub fn work() {
    println!("hard at work!");
}
```

----

### Folder-based modules

```rust
// ---- main.rs ----

// `mod workload;` declares a file-based module
mod workload;

fn main() {
    workload::work();
}
```

```rust
// ---- workload/mod.rs ----

pub fn work() {
    println!("hard at work!");
}
```

<small>`workload/mod.rs` and `workload.rs` are essentially the same, but the
former is commonly used when there are nested submodules.</small>

----

### Nested submodules

```text
|
|-src
  |- main.rs  // <- `use crate`
  |- workload
     |- mod.rs  // <- `use crate::workload`
     |- thing.rs  // <- `use crate::workload::thing`
```

---

## Visibility

In Rust, everything is **private by default**.

Publicly available types are marked with `pub`.

----

### Example

```rust
pub mod workload;

pub trait Distance {
    fn distance(&self, other: Self);
}

pub fn foo() {

}
```

----

### Structs

Struct fields are private by default.

A struct with non-public members can't be constructed or fully used outside
its module. This is often intended.

Struct functions are also not public by default.

----

```rust
pub struct Point {
    x: i32,
    y: i32
}

impl Point {
    pub fn new() -> Point {
        Point { x: 1, y: 2 }
    }
}
```

<small>Here, `x` and `y` are not accessible outside this module and
construction is only possible via `new(...)`.</small>

----

We can change this, if necessary, by adding `pub` to the fields.

```rust
pub struct Point {
    pub x: i32,
    pub y: i32
}
```

----

In general, making fields public should be avoided for libraries:

* Any change of the structure leads to API breakage
* Accessor functions are usually as fast as direct field access due to optimizations.

----

## Visibility scopes

```rust
// public, but only within its own crate
pub(crate) fn crate_local() {}

// private, but also accessible from the parent module
pub(super) fn visible_in_super_module() {}
```

---

## Quiz

----

How can we make this snippet compile?

```rust
mod sausage_factory {
    // Don't let anybody outside of this module see this!
    fn get_secret_recipe() -> String {
        String::from("Ginger")
    }

    fn make_sausage() {
        get_secret_recipe();
        println!("Sausage!");
    }
}

fn main() {
    sausage_factory::make_sausage();
}
```

Note: Put `pub` before `fn make_sausage()`. 

---

[Table of Contents](./README.md#/0/2)
