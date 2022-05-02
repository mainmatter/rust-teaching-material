---
title: CLI
---

# CLI

"Command Line Interface"

---

## `std::env`

`std::env` contains functions to inspect things like environment variables,
process arguments, the current working directory, or the `tmp` directory of the OS.

----

### `std::env::consts`

- `ARCH`: e.g. `x86_64` or `arm`
- `DLL_PREFIX`: `lib` on Linux/Mac, `""` on Windows
- `DLL_SUFFIX`: `.so`, `.dll`, `.dylib`
- `EXE_SUFFIX`: `.exe`, `""`
- `FAMILY`: e.g. `unix` or `windows`
- `OS`: e.g. `linux`, `macos`, `ios`, `windows`, ...

---

## Environment variables

----

### `var_os()`

`var_os()` can be used to read the value  
of an environment variable:

```rust
use std::env;

fn main() {
    match env::var_os("HOME") {
        Some(val) => println!("HOME: {:?}", val),
        None => println!("HOME is not defined in the environment."),
    }
}
```

```text
HOME: "/playground"
```

<small>`var_os()` returns `Option<OsString>`</small>

----

### `var()`

`var()` is the simpler version of `var_os()`, but fails for non-Unicode content:

```rust
use std::env;

fn main() {
    match env::var("HOME") {
        Ok(val) => println!("HOME: {:?}", val),
        Err(_) => println!("HOME is not defined in the environment."),
    }
}
```

```text
HOME: "/playground"
```

<small>`var()` returns `Result<String, VarError>`</small>

----

`var()` can fail in two different ways:

```rust
pub enum VarError {
    NotPresent,
    NotUnicode(OsString),
}
```

----

### `vars()`

`vars()` (and `vars_os()`) return an iterator over all environment variables:

```rust
use std::env;

fn main() {
    for (key, value) in env::vars() {
        println!("{}: {}", key, value);
    }
}
```

```text
CARGO: /playground/.rustup/toolchains/stable-x86_64-unknown-linux-gnu/bin/cargo
CARGO_HOME: /playground/.cargo
CARGO_MANIFEST_DIR: /playground
CARGO_PKG_AUTHORS: The Rust Playground
CARGO_PKG_NAME: playground
...
```

----

### Exercise

- Read the `PWD` environment variable
- Convert it to a `std::path::Path`
- Print the path
- Also print the parent path, if one exists

```text
PWD: "/playground"
Parent: "/"
```

<small>This exercise might not work on Windows. You can use the Rust Playground instead.</small>

----

```rust
use std::env;
use std::path::Path;

fn main() {
    let pwd = env::var("PWD").unwrap();
    let pwd = Path::new(&pwd);
    println!("PWD: {pwd:?}");

    if let Some(parent) = pwd.parent() {
        println!("Parent: {parent:?}");
    }
}
```

---

## Special OS folders

----

### `current_dir()`

Same thing as we did in the exercise, but in a cross-platform way:

```rust
use std::env;

fn main() {
    let pwd = env::current_dir().unwrap();
    println!("PWD: {pwd:?}");

    if let Some(parent) = pwd.parent() {
        println!("Parent: {parent:?}");
    }
}
```

<small>`current_dir()` returns `Result<PathBuf, std::io::Error>`</small>

----

### `temp_dir()`

`temp_dir()` returns the directory for  
temporary files of your OS:

```rust
use std::env;

fn main() {
    let dir = env::temp_dir();
    println!("Temporary directory: {}", dir.display());
}
```

<small>`temp_dir()` returns `PathBuf`, not `Result`!</small>

---

## Detour: `tempfile`

`tempfile` is a third-party crate that simplifies working with temporary
files and folders:

```rust
use std::io::Write;

fn main() {
    let mut tmpfile = tempfile::tempfile().unwrap();
    write!(tmpfile, "Hello World!").unwrap();
}
```

<small>`tempfile()` creates a temporary file we can write to and read from.  
File is deleted automatically once the variable is destroyed.</small>

----

### `NamedTempFile`

`NamedTempFile::new()` creates a  
"named" temporary file:

```rust
use std::io::Write;

fn main() {
    let mut tmpfile = tempfile::NamedTempFile::new().unwrap();
    write!(tmpfile, "Hello World!").unwrap();
    println!("{:?}", tmpfile.path())
}
```

```text
"/tmp/.tmpdRWLma"
```

<small>`file.persist(path)` can be used to convert from a temporary to permanent file.</small>

----

### `tempdir()`

`tempdir()` creates a temporary folder:

```rust
use tempfile::tempdir;
use std::fs::File;
use std::io::Write;

fn main() {
    // Create a directory inside of `std::env::temp_dir()`
    let dir = tempdir().unwrap();

    let file_path = dir.path().join("my-temporary-note.txt");
    let mut file = File::create(file_path).unwrap();
    writeln!(file, "Brian was here. Briefly.").unwrap();
}
```

<small>The folder and all its contents are deleted automatically once the variable is destroyed.</small>

---

## Detour: `Drop`

> The file is deleted automatically once the variable is destroyed.

How does this work?

----

When a value is no longer needed, Rust will run a "destructor" on that value.

```rust
pub trait Drop {
    fn drop(&mut self);
}
```

----

### Example

```rust
struct HasDrop {
    x: i32,
}

impl Drop for HasDrop {
    fn drop(&mut self) {
        println!("Dropping HasDrop!");
    }
}

fn main() {
    let _x = HasDrop { x: 42 };
    println!("Running!");
}
```

```text
Running!
Dropping HasDrop!
```

----

```rust
struct HasDrop;

impl Drop for HasDrop {
    fn drop(&mut self) {
        println!("Dropping HasDrop!");
    }
}

struct HasTwoDrops {
    one: HasDrop,
    two: HasDrop,
}

impl Drop for HasTwoDrops {
    fn drop(&mut self) {
        println!("Dropping HasTwoDrops!");
    }
}

fn main() {
    let _x = HasTwoDrops { one: HasDrop, two: HasDrop };
    println!("Running!");
}
```

```text
Running!
Dropping HasTwoDrops!
Dropping HasDrop!
Dropping HasDrop!
```
<!-- .element: class="fragment" -->

----

`tempfile::TempDir` implements `Drop` to remove the folder in the destructor:

```rust
impl Drop for TempDir {
    fn drop(&mut self) {
        let _ = remove_dir_all(self.path());
    }
}
```

<small>see [https://docs.rs/tempfile/](https://docs.rs/tempfile/3.3.0/src/tempfile/dir.rs.html#403-407)</small>

Why the `let _ =`?
<!-- .element: class="fragment" -->

Note: The `remove_dir_all()` function returns a `Result` and those *must* be used. 
If the removal fails we can't do anything about it in the destructor though, and
so we explicitly ignore the result.

---

## Command line arguments

----

### `args()`

`args()` returns an iterator over the command line arguments, including the path
of the executable as the first element:

```rust
use std::env;

fn main() {
    for argument in env::args() {
        println!("{}", argument);
    }
}
```

```text
target/debug/cli-example
foo
--bar=42
```

---

## Exercise

Build a very simple calculator:

- Read all command line argument  
  (excluding executable path)
- Convert them to `i32`
- Show an error message if the conversion fails
- Sum up all of the `i32` and print the result

----

```rust
use std::env;

fn main() {
    let numbers: Result<Vec<i32>, _> = env::args()
            .skip(1)
            .map(|x| x.parse())
            .collect();

    let numbers = match numbers {
        Ok(numbers) => numbers,
        Err(_) => {
            println!("Could not parse arguments");
            return;
        }
    };

    let sum: i32 = numbers.iter().sum();

    println!("Result: {sum}")
}
```

```text
$ cargo run -- 1 4 42
Result: 47
```

---

## Detour: `clap`

The `clap` crate allows us to build a command line parser in a declarative way:

```rust
use clap::Parser;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// Name of the person to greet
    name: String,

    /// Number of times to greet
    #[clap(short, long, default_value_t = 1)]
    count: u8,
}

fn main() {
    let args = Args::parse();

    for _ in 0..args.count {
        println!("Hello {}!", args.name)
    }
}
```

----

```text
$ demo --help
clap [..]
Simple program to greet a person

USAGE:
    demo [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of the person to greet

OPTIONS:
    -c, --count <COUNT>    Number of times to greet [default: 1]
    -h, --help             Print help information
    -V, --version          Print version information
```

----

### Exercise

- Convert the calculator from the previous exercise to use `clap` instead.
- Add support for a `--multiply` flag.

<small>Hint: The `derive` feature of `clap` is not enabled by default,  
but we need it to use `#[derive(Parser)]`.</small>

----

```rust
use clap::Parser;

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// The numbers to add or multiply
    numbers: Vec<i32>,

    /// Set the calculator to "multiply" mode
    #[clap(short, long)]
    multiply: bool,
}

fn main() {
    let args = Args::parse();

    let result: i32 = if args.multiply {
        args.numbers.iter().product()
    } else {
        args.numbers.iter().sum()
    };

    println!("Result: {result}")
}
```

---

[Table of Contents](./README.md#/0/3)
