---
title: Useful crates
---

# Useful crates

---

## `rand`

https://github.com/rust-random/rand

```rust
use rand::prelude::*;

let a: bool = rand::random();  // true
let b: f32 = rand::random();   // 0.973282
let c: char = rand::random();  // 'Y'
```

---

## `regex`

https://github.com/rust-lang/regex

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"(?x)
(?P<year>\d{4})  # the year
-
(?P<month>\d{2}) # the month
-
(?P<day>\d{2})   # the day
").unwrap();
    let captures = re.captures("2010-03-14").unwrap();

    assert_eq!("2010", &captures["year"]);
    assert_eq!("03", &captures["month"]);
    assert_eq!("14", &captures["day"]);
}
```

---

## `rayon`

https://github.com/rayon-rs/rayon

```rust
use rayon::prelude::*;

fn sum_of_squares(input: &[i32]) -> i32 {
    input.par_iter() // <-
         .map(|&i| i * i)
         .sum()
}
```

---

## `time`

https://github.com/time-rs/time

```rust
let sydney = datetime!(2000-01-01 0:00 +11);
let new_york = sydney.to_offset(offset!(-5));
let los_angeles = sydney.to_offset(offset!(-8));
assert_eq!(sydney.hour(), 0);
assert_eq!(sydney.day(), 1);
assert_eq!(new_york.hour(), 8);
assert_eq!(new_york.day(), 31);
assert_eq!(los_angeles.hour(), 5);
assert_eq!(los_angeles.day(), 31);
```

---

## Error Handling

----

### `anyhow`

https://github.com/dtolnay/anyhow

```rust
use anyhow::{Context, Result};

fn main() -> Result<()> {
    // ...
    it.detach().context("Failed to detach the important thing")?;

    let content = std::fs::read(path)
        .with_context(|| format!("Failed to read instrs from {}", path))?;
    // ...
}
```

```text
Error: Failed to read instrs from ./path/to/instrs.json

Caused by:
    No such file or directory (os error 2)
```

---

### `thiserror`

https://github.com/dtolnay/thiserror

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DataStoreError {
    #[error("data store disconnected")]
    Disconnect(#[from] io::Error),
    #[error("the data for key `{0}` is not available")]
    Redaction(String),
    #[error("invalid header (expected {expected:?}, found {found:?})")]
    InvalidHeader {
        expected: String,
        found: String,
    },
    #[error("unknown data store error")]
    Unknown,
}
```

---

## CLI

----

### `clap`

https://github.com/clap-rs/clap

```rust
use clap::Parser;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// Name of the person to greet
    #[clap(short, long)]
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
    demo[EXE] [OPTIONS] --name <NAME>

OPTIONS:
    -c, --count <COUNT>    Number of times to greet [default: 1]
    -h, --help             Print help information
    -n, --name <NAME>      Name of the person to greet
    -V, --version          Print version information
```

----

### `ansi_term`

https://github.com/ogham/rust-ansi-term

```rust
use ansi_term::Colour::{Blue, Yellow};

println!("Demonstrating {} and {}!",
         Blue.bold().paint("blue bold"),
         Yellow.underline().paint("yellow underline"));

println!("Yellow on blue: {}", Yellow.on(Blue).paint("wow!"));
```

----

### `indicatif`

https://github.com/console-rs/indicatif

![](https://raw.githubusercontent.com/console-rs/indicatif/main/screenshots/download.gif)

----

### `dialoguer`

https://github.com/mitsuhiko/dialoguer

```rust
use dialoguer::Confirm;

if Confirm::new().with_prompt("Do you want to continue?").interact()? {
    println!("Looks like you want to continue");
} else {
    println!("nevermind then :(");
}
```

```text
Do you want to continue? [Y/n]
```

---

## Testing and Benchmarks

----

### `criterion`

https://github.com/bheisler/criterion.rs

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 1,
        1 => 1,
        n => fibonacci(n-1) + fibonacci(n-2),
    }
}

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("fib 20", |b| b.iter(|| fibonacci(black_box(20))));
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
```

----

### `claim`

https://github.com/svartalf/rust-claim

```rust
let maybe = Some(42);
assert_some_eq!(maybe, 42);

let foo = 'f';
assert_matches!(foo, 'A'..='Z' | 'a'..='z');
```

----

### `insta`

https://github.com/mitsuhiko/insta

```rust
#[test]
fn test_hello_world() {
    insta::assert_debug_snapshot!(vec![1, 2, 3]);
}
```

<small>Roughly similar to https://jestjs.io/docs/snapshot-testing</small>

---

## HTTP

----

### `reqwest`

https://github.com/seanmonstar/reqwest

```rust
use std::collections::HashMap;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::blocking::get("https://httpbin.org/ip")?
        .json::<HashMap<String, String>>()?;
    println!("{:#?}", resp);
    Ok(())
}
```

----

### `actix`

https://actix.rs

```rust
use actix_web::{get, web, App, HttpServer, Responder};

#[get("/hello/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/hello", web::get().to(|| async { "Hello World!" }))
            .service(greet)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

----

### `sqlx`

https://github.com/launchbadge/sqlx

```rust
let mut rows = sqlx::query("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .fetch(&mut conn);

while let Some(row) = rows.try_next().await? {
    // map the row into a user-defined domain type
    let email: &str = row.try_get("email")?;
}
```

----

### `serde`

https://github.com/serde-rs/serde

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point { x: 1, y: 2 };

    // Convert the Point to a JSON string.
    let serialized = serde_json::to_string(&point).unwrap();

    // Prints serialized = {"x":1,"y":2}
    println!("serialized = {}", serialized);

    // Convert the JSON string back to a Point.
    let deserialized: Point = serde_json::from_str(&serialized).unwrap();

    // Prints deserialized = Point { x: 1, y: 2 }
    println!("deserialized = {:?}", deserialized);
}
```

----

### `tracing`

https://github.com/tokio-rs/tracing

```rust
use tracing::info;
use tracing_subscriber;

fn main() {
    // install global subscriber configured based on RUST_LOG envvar.
    tracing_subscriber::fmt::init();

    let number_of_yaks = 3;
    info!(number_of_yaks, "preparing to shave yaks");

    let number_shaved = yak_shave::shave_all(number_of_yaks);
    info!(
        all_yaks_shaved = number_shaved == number_of_yaks,
        "yak shaving completed."
    );
}
```

```text
2022-05-08T10:54:57.904778Z  INFO demo: preparing to shave yaks number_of_yaks=3
2022-05-08T10:54:57.904835Z  INFO demo: yak shaving completed. all_yaks_shaved=false
```

----

### `moka`

> Moka is a fast, concurrent cache library for Rust.

<small>from https://github.com/moka-rs/moka</small>

---

[Table of Contents](./README.md#/0/3)
