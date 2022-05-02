---
title: What is Rust?
---

# What is Rust?

----

> Rust has been Stack Overflow’s most loved language for six years in a row.

from [https://stackoverflow.com](https://insights.stackoverflow.com/survey/2021)

----

> Rust is a multi-paradigm, general-purpose programming language designed for
> performance and safety, especially safe concurrency.

from [https://en.wikipedia.org](https://en.wikipedia.org/wiki/Rust_(programming_language))

----

> Rust is an empathic systems programming language that is determined to not
> let you shoot yourself in the foot.

from https://ferrous-systems.com

----

> What I find so nice about Rust is that once it compiles it also very likely
> works which is obviously not at all how things are when doing JS.

from... my boss

----

> A language empowering everyone to build reliable and efficient software.

from https://www.rust-lang.org

---

## Summary

- Performance / Concurrency
- Safety / Reliability
- Empathetic / Empowering

----

### Concurrency

Doing things as fast as possible, which, these days, means taking advantage of
multi-threading and concurrency.

----

- The type system detects concurrent access to data and requires synchronisation
- Rust detects when unsynchronized access is safely possible
- Rust protects from data races

Note: This is possible because Rust guarantees that *anything* can only be
mutated if nothing else is currently accessing it.

----

### Performance

- These properties are guaranteed at compile time and have no runtime cost!
- Optimizing compiler based on LLVM
- Features with runtime cost are explicit and hard to activate "by accident"
- No reflection
- Zero-cost abstractions
- "Pay what you use": Rust has features with a runtime cost in an explicit and
  visible way. Unused features do not come with an associated cost.

----

### Safety / Reliability

Memory-safety and thread-safety are guaranteed at compile-time to avoid crashes
and bugs at run-time.

- Rust is memory-safe
- No illegal memory access
- Deallocation is automated


Note:
Warning: memory **leaks** are *safe* by that definition!

----

### Empathy / Empowering

Rust has excellent tooling that tries to help software developers as much as
possible.

The compiler is your best friend… but a very pedantic one sometimes… 😄

---

## Some Rust

```rust
use std::io; // <1>
use std::io::prelude::*;
use std::fs::File;

fn main() -> Result<(), io::Error> { // <2>
    let open_file = File::open("test.txt"); // <3>

    let mut file = match open_file { // <4>
        Ok(file) => file,
        Err(e) => return Err(e)
    };

    let mut buffer = String::new(); // <5>
    file.read_to_string(&mut buffer)?; // <6>
    println!("{}", buffer);

    Ok(()) // <7>
}
```

Note:

1. Imports from standard library (or third-party packages)
2. `main()` function as main entry point into application 
   and `Result` (vs. exceptions)
3. Regular function call like in other languages
4. Pattern matching (more on that later…)
5. `String` as variable length character array
6. Reading data from file into the string array
7. Returning `Ok` variant of `Result`

---

## History

- Rust is roughly 10 years old
- An experimental project by [Graydon Hoare](https://github.com/graydon)
- Adopted by [Mozilla](https://www.mozilla.org/)
- Presented to the public at version 0.4 in 2012
- Looked a bit Go-like back then

----

### Focus

- Rust has lost many features from 2012 to 2014
- Garbage collector, evented runtime, complex error handling
    - All present once, now gone
- Orientation towards a usable systems programming language

Note: "systems programming language" means being able to gain low-level access
to the underlying hardware.

----

### Development

- Always together with a larger project (e.g. [Servo](https://github.com/servo/servo))
- Early adoption of regular releases, deprecations and an RFC process

----

### Release Method

- Nightly releases
    - experimental features are only present on nighly releases
- Every 6 weeks, the current nightly is promoted to beta
- After 6 weeks of testing, beta becomes stable
- Guaranteed backwards-compatibility
- Makes small iterations easier

---

## Quiz

----

Why are you interested in Rust?

Where are you planning to use it?

---

[Table of Contents](./README.md#/0/1)
