---
title: Documentation
---

# Documentation

---

## `std` Documentation

The standard library documentation is hosted at https://doc.rust-lang.org/std/.

A local, offline version can be opened with:

```shell
$ rustup doc --std
```

----

### Example: The `std::vec` Module

<iframe src="https://doc.rust-lang.org/std/vec/" width="100%" height="500">
</iframe>

Note: It starts with some examples, then lists any `struct`s, traits, or functions the module exports.

---

## `rustdoc`

Rust provides a standard documentation generator called `rustdoc`.
It is commonly used through:

```shell
$ cargo doc
```

Because of this, Rust code is almost always documented in a common format.

Note: The stdlib is also using `rustdoc` to generate the docs.

----

### Crate Documentation

Documentation for crates hosted on http://crates.io/ can be found at https://docs.rs/.

Some crates may also have other documentation found via the "Documentation" link on their listing on http://crates.io/.

----

### Example: The `semver` crate

<iframe src="https://docs.rs/semver/1.0.9/semver/" width="100%" height="500">
</iframe>

---

## How is it Generated?

`rustdoc` can read Rust code and Markdown documents.

`//!` and `///` comments are read as Markdown.

```rust
//! Module documentation. (e.g. the 'Examples' part of `std::vec`).

/// Document functions, structs, traits and values.
/// This documents a **function**.
fn function_with_documentation() {}

// This comment will not be shown as documentation.
// The function itself will be.
fn function_without_documentation() {}
```

----

### Code blocks

By default, code blocks in documentation are compiled as Rust and tested.

```rust
/// This function always returns `true`.
/// 
/// ## Example
/// 
/// ```
/// assert_eq!(always_true(), true)
/// ```
fn always_true() -> bool { true }
```

Note: Testing will be discussed in the next module.

----

### No-Run code blocks

This code will not be run, as it doesn't terminate.

```rust
/// ```no_run
/// serve();
/// ```
fn serve() -> ! { loop {} }
```

---

## Cargo integration

This command builds and opens the docs to your current project
and all of its dependencies:

```shell
$ cargo doc --open
```

---

[Table of Contents](./README.md#/0/2)
