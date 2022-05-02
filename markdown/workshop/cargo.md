---
title: cargo
---

# `cargo`

Official package manager and build tool for Rust

---

## Projects

A cargo project contains (at minimum):

- `Cargo.toml`: Manifest file
- `src/main.rs` or `src/lib.rs`: Main entrypoint source file

----

In addition, a cargo project can contain:

- `benches/`: Benchmarks
- `examples/`: Usage examples
- `tests/`: Integration tests
- `build.rs`: Build script

---

## `Cargo.toml`

The [Cargo Manifest](https://doc.rust-lang.org/cargo/reference/manifest.html) is written using [TOML](https://toml.io/):

```toml
[package]
name = "tcp-mailbox"
version = "0.1.0"

[dependencies]
async-std = "1" # would also choose 1.5
clap = "2.2" # would also choose 2.3
```

<small>Dependencies are loaded from https://crates.io, the official package registry of Rust.</small>

---

## Dependencies

Cargo knows 3 different kinds of dependencies:

- normal dependencies
- development dependencies
- build dependencies

----

### Example

```toml
[dependencies]
async-std = "1"

[build-dependencies]
cbindgen = "0.5"

[dev-dependencies]
quickcheck = "0.9"
```

----

### Git dependencies

Dependencies can be loaded via `git` instead of from crates.io:

```toml
[dependencies]
async-std = { version = "1", git = "https://github.com/skade/async-std.git", branch = "my-new-feature" }
```

----

### Local dependencies

Dependencies can also be loaded from the local hard-drive:

```toml
[dependencies]
async-std = { version = "1", path = "/my/local/path" }
```

----

### Publishing with non-crates.io dependencies

crates.io only accepts crates with dependencies that are also published on crates.io.

Git and local dependencies are not allowed.

----

### Usage

Dependencies that are declared in the `Cargo.toml` file can be imported with `use` statements:

```rust
use serde_json::Value;

fn main() {
    let data = r#" { "name": "John Doe", "age": 43, ... } "#;
    let v: Value = serde_json::from_str(data)?;
    println!(
        "Please call {} at the number {}",
        v["name"],
        v["phones"][0]
    );
}
```

----

In Rust 2015 you needed to declare crates via the `extern crate` statement:

```rust
extern crate serde_json; // <-

fn main() {
    use serde_json::Value;

    let data = r#" { "name": "John Doe", "age": 43, ... } "#;
    let v: Value = serde_json::from_str(data)?;
    println!(
        "Please call {} at the number {}",
        v["name"],
        v["phones"][0]
    );
}
```

Note: Explain the `edition` option in `Cargo.toml` ?

---

## Versioning

In the Rust community [Semantic Versioning](https://semver.org) is the recommended versioning standard.

- The major version must be raised if there are breaking interface changes.
- The minor version must be raised if new features are added
- The patch version marks bug fixes and performance improvements.

----

### Pre-release

If the version of a library is below `1`, it is considered "pre-release", which
means breaking interface changes can happen with *every minor version*, and in
the `0.0.x` case, with every *patch* version.

----

### Version expressions

Cargo allows expressing dependency version ranges in different fashions.

- `=1.2.3`: Exact version, cargo will only use that one
- `0.1`: Any patch version of the "0.1" series
- `1.0`: Any minor version of the "1.x" series
- `< 0.8`: Any minor version smaller than "0.8"

For more details, check the [docs](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html)

----

### Version resolution

At the first build (or through `cargo update`), cargo calculates a version tree
fulfilling the constraints stated in `Cargo.toml`.

If successful, it will be saved in a Lockfile (`Cargo.lock`).

The Lockfile should always be kept under version control for applications.

For libraries, it can be checked in to provide a repeatable test environment.

---

## Workspaces

Cargo can group multiple projects in a workspace.

They then share settings and the same `target` directory.

See the [documentation](https://doc.rust-lang.org/cargo/reference/workspaces.html) for details.

---

## Feature flags

Rust provides the ability to ignore certain code parts on compilation.

----

`features` can be registered in the `Cargo.toml` file:

```toml
[features]
default = []
# Turns on experimental features.
experimental = []
```

```rust
#[cfg(experimental)]
fn amazing_function() {

}
```

----

Optional `features` of dependencies can be enabled like this:

```toml
[dependencies]
my_lib = { version = "0.1", features = ["experimental"] }
```

---

## Commands

----

### `cargo build`

`cargo build` builds the whole project and puts the result in the directory `target`.

By default, cargo uses the **Debug profile**, which means that the resulting binary with be unoptimized and with debug symbols!

`cargo build --release` uses the optimizing profile.

Note: Debug builds run significantly slower. Make sure to build release builds for better performance!

----

### `cargo run`

If the project contains an application, you can run it using `cargo run -- [Arguments]`.

If it contains multiple binaries, the name of the intended binary can be given using `--bin <name>`.

To run a usage example, use `--example <name>`.

Note: This is also using debug profile by default.

----

### `cargo test`

`cargo test` runs all tests.

You can provide a test name or module name to filter the test being run.

`cargo test --workspace --examples` runs all tests, including documentation test and compilation of examples!

Note: This is also using debug profile by default.

----

### `cargo bench`

`cargo bench` runs all benchmarks.

Benchmarks default to the release profile.

Benchmarks can be written using the [`criterion`](https://github.com/bheisler/criterion.rs) crate.

---

## Publishing

- "Log in with GitHub" on https://crates.io
- Generate API token on https://crates.io/settings/tokens
- `cargo login`
- `cargo publish`

---

[Table of Contents](./README.md#/0/3)
