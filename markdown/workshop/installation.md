---
title: Installation
---

# Installation

---

## rustup

`rustup` installs and manages  
Rust versions on your machine

https://rustup.rs

Note: Please visit the page now and follow the instructions.

----

On Linux and macOS:

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

----

`rustup install` downloads and installs a new version of Rust:

```shell
# Install Rust v1.55.0
$ rustup install 1.55.0

# Install the latest `stable` release of Rust
$ rustup install stable
```

----

`rustup default` sets the default version to use on your machine:

```shell
# Use Rust v1.55.0 for all projects
$ rustup default 1.55.0

# Use the latest downloaded `stable` release for all projects
$ rustup default stable
```

----

`rustup override` can override the Rust version per folder on the file system:

```shell
# Use Rust v1.55.0 for the current directory
$ rustup override set 1.55.0

# Use the latest downloaded `stable` release for the current directory
$ rustup override set stable
```

----

`rustup doc` opens the offline documentation for the currently active Rust
version in your browser: 

```shell
# Display documentation in browser
$ rustup doc [--std]
```

----

Rust is able to cross-compile to other architectures.

`rustup target` can be used to figure out what targets are available and
install the necessary tools.

```shell
# List supported targets
$ rustup target list

# Add and install a target to the toolchain (here: to cross-compile for an ARMv6-M target)
$ rustup target add thumbv6m-none-eabi
```

---

## rustc

`rustc` is the low-level compiler that build and links Rust code

```shell
$ rustc --version
rustc 1.58.0 (02072b482 2022-01-11)
```

----

Create a `hello_world.rs` file somewhere:

```rust
fn main() {
    println!("Hello, world!");
}
```

Run the compiler:

```shell
$ rustc hello_world.rs
```

Run the compiled binary:

```shell
$ ./hello_world
Hello, world!
```

---

## cargo

`cargo` is the official package manager and build tool for Rust projects.

```shell
$ cargo --version
cargo 1.58.0 (7f08ace4f 2021-11-24)
```

<small>`cargo` is automatically installed by `rustup`.</small>

----

Create a new Rust project:

```shell
$ cargo new hello-world
$ cd hello-world
$ ls -a1
.git/
.gitignore
Cargo.toml
src/
```

<small>`Cargo.toml` is like the `package.json` in JavaScript,
or the `pom.xml` in `Java`.</small>

----

`cargo new` generates a "Hello, world!"  
example by default:

```shell
$ cat src/main.rs
fn main() {
    println!("Hello, world!");
}
```

<small>The `main()` function in `src/main.rs` is the main entrypoint of a
Rust application.</small>

----

`cargo build` can be used to compile the project. `cargo run` compiles the
application and immediately runs it.

```shell
$ cargo build
   Compiling hello-world v0.1.0 (/Users/jd/Code/hello-world)
    Finished debug [unoptimized + debuginfo] target(s) in 0.35 secs

$ cargo run
    Finished debug [unoptimized + debuginfo] target(s) in 0.00 secs
     Running `target/debug/hello-world`
Hello, world!
```

----

`cargo fmt` can be used to format your code according to the official
style guide.

```shell
$ cargo fmt
```

<small>This is like running `prettier` in JavaScript or `black` in Python.</small>

----

If you think that the Rust compiler is not pedantic enough... run `cargo clippy`

```shell
$ cargo clippy
```

<small>You can think of `clippy` like `eslint` in JavaScript or `flake8` in Python.</small>

---

## Rust Playground

https://play.rust-lang.org

Note: If all of the above does not work for some reason, you can also try out
Rust in the browser on the Rust playground website.

---

## IDEs

* Intellij Rust: https://www.jetbrains.com/rust/
* rust-analyzer: https://rust-analyzer.github.io

Note: Unless you are a hardcore vim or emacs users, I'd recommend installing
one of these now.

**15min Break?**

---

[Table of Contents](./README.md#/0/1)
