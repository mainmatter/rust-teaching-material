---
title: Networking
---

# Networking

A high-level overview of the ecosystem

---

## `std::net`

Low-level networking primitives

https://doc.rust-lang.org/std/net/

---

## sync vs. async

Rust used to only support synchronous APIs with callbacks.

`async` and the `Future` trait have been introduced in Rust 1.36.0.

----

### Example

```rust
use std::collections::HashMap;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let resp = reqwest::get("https://httpbin.org/ip")
        .await? // <--
        .json::<HashMap<String, String>>()
        .await?; // <--

    println!("{:#?}", resp);

    Ok(())
}
```

---

## `tokio`

> Tokio is an asynchronous runtime for the Rust programming language. It
> provides the building blocks needed for writing network applications.

<small>from https://tokio.rs</small>

---

## Detour: `embassy`

`embassy` is another async runtime for Rust, specifically targetting embedded devices.

<small>see https://github.com/embassy-rs/embassy</small>

----

```rust
use defmt::info;
use embassy::executor::Spawner;
use embassy::time::{Duration, Timer};
use embassy_nrf::gpio::{AnyPin, Input, Level, Output, OutputDrive, Pin, Pull};
use embassy_nrf::Peripherals;

#[embassy::task]
async fn blink(pin: AnyPin) {
    let mut led = Output::new(pin, Level::Low, OutputDrive::Standard);

    loop {
        led.set_high();
        Timer::after(Duration::from_millis(150)).await;
        led.set_low();
        Timer::after(Duration::from_millis(150)).await;
    }
}

#[embassy::main]
async fn main(spawner: Spawner, p: Peripherals) {
    // Spawned tasks run in the background, concurrently.
    spawner.spawn(blink(p.P0_13.degrade())).unwrap();

    let mut button = Input::new(p.P0_11, Pull::Up);
    loop {
        // Asynchronously wait for GPIO events, allowing other tasks
        // to run, or the core to sleep.
        button.wait_for_low().await;
        info!("Button pressed!");
        button.wait_for_high().await;
        info!("Button released!");
    }
}
```

---

## `reqwest`

> An ergonomic, batteries-included HTTP Client for Rust.

<small>see https://github.com/seanmonstar/reqwest</small>

----

### `async` API

```rust
use std::collections::HashMap;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let resp = reqwest::get("https://httpbin.org/ip")
        .await?
        .json::<HashMap<String, String>>()
        .await?;

    println!("{:#?}", resp);

    Ok(())
}
```

----

### sync API

```rust
use std::collections::HashMap;

fn main() -> anyhow::Result<()> {
    let resp = reqwest::blocking::get("https://httpbin.org/ip")?
        .json::<HashMap<String, String>>()?;

    println!("{:#?}", resp);

    Ok(())
}
```

----

### Exercise

- Load the content of https://pokeapi.co/api/v2/pokemon/42/ using the `reqwest` crate
- Print the list of `moves` that this Pokémon can learn in the `red-blue`
  version group and at which level it will learn them

<small>Hint: You might want to enable the `blocking` and `json` features of `reqwest`.</small>

Note: this might not work in the Rust Playground due to networking restrictions there.

----

```rust
fn main() {
    let url = "https://pokeapi.co/api/v2/pokemon/42/";
    let response = reqwest::blocking::get(url).unwrap();
    let pokemon: Pokemon = response.json().unwrap();

    for move_details in pokemon.moves {
        // ...
    }
}
```

---

## Detour: `anyhow`

`anyhow` allows us to replace a lot of  
`.unwrap()` calls with `?`:

```rust
fn main() -> anyhow::Result<()> {
    let url = "https://pokeapi.co/api/v2/pokemon/42/";
    let response = reqwest::blocking::get(url)?; // <--
    let pokemon: Pokemon = response.json()?; // <--

    for move_details in pokemon.moves {
        // ...
    }

    Ok(()) // <--
}
```

----

Let's see what happens if we run this  
with a different URL:

```rust
fn main() -> anyhow::Result<()> {
    let url = "https://some-broken-url.com/"; // <--
    let response = reqwest::blocking::get(url)?;
    let pokemon: Pokemon = response.json()?;

    for move_details in pokemon.moves {
        // ...
    }

    Ok(())
}
```

----

```text
Error: error sending request for url (https://some-broken-url.com/): error trying to connect: dns error: failed to lookup address information: nodename nor servname provided, or not known

Caused by:
    0: error trying to connect: dns error: failed to lookup address information: nodename nor servname provided, or not known
    1: dns error: failed to lookup address information: nodename nor servname provided, or not known
    2: failed to lookup address information: nodename nor servname provided, or not known
```

----

### Adding context


```rust
use anyhow::Context;

fn main() -> anyhow::Result<()> {
    let url = "https://some-broken-url.com/"; // <--
    let response = reqwest::blocking::get(url)
        .context("Failed to load from Pokemon API")?;
    let pokemon: Pokemon = response.json()
        .context("Failed to decode JSON payload from Pokemon API")?;

    // ...
}
```

```text
Error: Failed to load Pokemon API

Caused by:
    0: error sending request for url (https://some-broken-url.com/): error trying to connect: dns error: failed to lookup address information: nodename nor servname provided, or not known
    1: error trying to connect: dns error: failed to lookup address information: nodename nor servname provided, or not known
    2: dns error: failed to lookup address information: nodename nor servname provided, or not known
    3: failed to lookup address information: nodename nor servname provided, or not known
```

---

## `actix`

[actix.rs](https://actix.rs) is a commonly used web framework for Rust:

```rust
use actix_web::{get, web, App, HttpServer, Responder};

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

#[get("/hello/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
    let name = name.into_inner();
    format!("Hello {name}!")
}
```
 
----

### Exercise

- Use the example code from the previous  
  slide as a starting point
- Add a route `/calculate/{numbers}`  
  where `numbers` is e.g. `1,4,42`
- `numbers` should be parsed into `Vec<i32>`
- If parsing fails, return an empty string
- If parsing succeeds, return the sum of the numbers

<small>Bonus task: Add support for a `?multiply` query parameter.</small>

----

```rust
#[get("/calculate/{numbers}")]
async fn calculate(numbers: web::Path<String>) -> impl Responder {
    let numbers: Result<Vec<i32>, _> = numbers.into_inner()
            .split(',')
            .map(|x| x.parse())
            .collect();

    match numbers {
        Ok(numbers) => {
            let sum: i32 = numbers.iter().sum();
            sum.to_string()
        }
        Err(_) => "".to_string(),
    }
}
```

----

```rust
use serde::Deserialize;

#[derive(Deserialize)]
struct Query {
  multiply: Option<String>,
}

#[get("/calculate/{numbers}")]
async fn calculate(
  numbers: web::Path<String>, 
  query: web::Query<Query>,
) -> impl Responder {
  let numbers: Result<Vec<i32>, _> = numbers.into_inner()
          .split(',')
          .map(|x| x.parse())
          .collect();

  match numbers {
    Ok(numbers) => {
      let result: i32 = match query.multiply {
        Some(_) => numbers.iter().product(),
        None => numbers.iter().sum(),
      };
      result.to_string()
    }
    Err(_) => "".to_string(),
  }
}
```
<!-- .element: style="font-size: 0.9rem" -->

---

[Table of Contents](./README.md#/0/3)
