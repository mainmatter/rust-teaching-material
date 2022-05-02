---
title: std::fs
---

# `std::fs`

aka. the file system module

---

## Writing files

```rust
use std::fs;

fn main() {
    fs::write("foo.txt", "fooooo").unwrap();
    
    // also supports byte slices (aka. `&[u8]`)
    fs::write("bar.txt", b"barrrr").unwrap();
}
```

----

`fs::write()` is the short version of:

```rust
use std::fs;
use std::io::Write;

fn main() {
    let file = fs::File::create("foo.txt").unwrap();
    file.write_all("fooooo").unwrap();
}
```

<small>To use the `write_all()` method, we must import the `Write` trait that contains it.</small>

----

### Exercise

Write the numbers from 1 to 42 into  
a file called `numbers.txt`:

```text
1
2
3
4
...
```

----

```rust
use std::fs;
use std::io::Write;

fn main() {
    let mut file = fs::File::create("numbers.txt").unwrap();
    for n in 1..=42_u32 {
        file.write_all((n.to_string() + "\n").as_bytes()).unwrap();        
    }
}
```

----

The `write!()` macro can simplify things:

```rust
use std::fs;
use std::io::Write;

fn main() {
    let mut file = fs::File::create("numbers.txt").unwrap();
    for n in 1..=42_u32 {
        write!(file, "{n}\n").unwrap();
    }
}
```

---

## Reading files

```rust
use std::fs;

fn main() {
    let content = fs::read("foo.txt").unwrap();
    println!("{:?}", content);
}
```

```text
[102, 111, 111, 111, 111, 111]
```

<small>`fs::read()` returns `Result<Vec<u8>>` and can be used to read binary files.</small>

----

### Reading **text** files

```rust
use std::fs;

fn main() {
    let content = fs::read_to_string("foo.txt").unwrap();
    println!("{:?}", content);
}
```

```text
"fooooo"
```

<small>`fs::read()` returns `Result<String>` and should only be used for UTF8 text files.</small>

----

### Reading text files line-by-line

```rust
use std::fs;

fn main() {
    let file = fs::File::open("foo.txt").unwrap();
    let reader = std::io::BufReader::new(file);
    for line in reader.lines() {
        println!("{}", line.unwrap());
    }
}
```

<small>`lines()` returns an iterator that yields `Result<String>` elements.</small>

----

### Exercise

Read the lines of the `numbers.txt` file into a `Vec` and debug-print it.

----

```rust
use std::fs;
use std::io::BufRead;

fn main() {
    let file = fs::File::open("numbers.txt").unwrap();
    let reader = std::io::BufReader::new(file);
    let vec: Vec<_> = reader.lines().collect();
    println!("{:?}", vec);
}
```

```text
[Ok("1"), Ok("2"), Ok("3"), Ok("4"), Ok("5"), Ok("6"), Ok("7"), Ok("8"), Ok("9"), Ok("10"), Ok("11"), Ok("12"), Ok("13"), Ok("14"), Ok("15"), Ok("16"), Ok("17"), Ok("18"), Ok("19"), Ok("20"), Ok("21"), Ok("22"), Ok("23"), Ok("24"), Ok("25"), Ok("26"), Ok("27"), Ok("28"), Ok("29"), Ok("30"), Ok("31"), Ok("32"), Ok("33"), Ok("34"), Ok("35"), Ok("36"), Ok("37"), Ok("38"), Ok("39"), Ok("40"), Ok("41"), Ok("42")]
```

<small>`vec` is a `Vec<std::io::Result<String>>` (same as `Vec<Result<String, std::io::Error>>`)</small>

----

We can `collect()` into `Result<Vec<_>, _>` instead:

```rust
use std::fs;
use std::io::BufRead;

fn main() {
    let file = fs::File::open("numbers.txt").unwrap();
    let reader = std::io::BufReader::new(file);
    let vec: Result<Vec<_>, _> = reader.lines().collect();
    println!("{:?}", vec);
}
```

```text
Ok(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42"])
```

---

## Copying files

```rust
use std::fs;

fn main() {
    // Copy `foo.txt` to `bar.txt`
    fs::copy("foo.txt", "bar.txt").unwrap();
}
```

---

## Renaming files

```rust
use std::fs;

fn main() {
    // Rename `foo.txt` to `bar.txt`
    fs::rename("foo.txt", "bar.txt").unwrap();
}
```

---

## Reading metadata of a file

```rust
use std::fs;

fn main() {
    let metadata = fs::metadata("foo.txt").unwrap();
    println!("{:#?}", metadata);
}
```

<small>Returns a [fs::Metadata](https://doc.rust-lang.org/std/fs/struct.Metadata.html) struct.</small>

---

## Creating folders

```rust
use std::fs;

fn main() {
    fs::create_dir_all("foo/bar/baz").unwrap();
}
```

<small>The `mkdir -p foo/bar/baz` of Rust.</small>

---

## Reading folder contents

```rust
use std::fs;

fn main() {
    for entry in fs::read_dir("foo").unwrap() {
        let path = entry.unwrap().path();
        println!("{:?}", path);
    }
}
```

<small>Each item of the `read_dir()` iterator is a `Result`, because the file
system might fail while we are iterating.</small>

---

## `std::path`

The sister module of `std::fs`, related to file system paths.

----

The `std::path` module provides `Path` and `PathBuf` structs.

These are essentially thin wrappers around `OsStr` and `OsString`.

----

You can think of `Path` roughly like a slice of `PathBuf`:

```rust
use std::path::PathBuf;

fn main() {
    let path_buf = PathBuf::from("/tmp/foo/bar.txt");
    let parent = path_buf.parent(); // <- `Option<&Path>`
    println!("{parent:?}");
    
    path_buf.push("what");
    println!("{path_buf:?}");
}
```

```text
Some("/tmp/foo")
"/tmp/foo/bar.txt/what"
```

----

- `PathBuf` is like `String` is like `Vec`
- `Path` is like `&str` is like `&[char]`

---

[Table of Contents](./README.md#/0/3)
