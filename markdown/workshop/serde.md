---
title: serde
---

# `serde`

**Ser**ialization and **De**serialization

https://serde.rs/

----

## Example

```rust
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct Move {
    id: usize,
    direction: Direction,
}

#[derive(Debug, Serialize, Deserialize)]
enum Direction { North, South, East, West }

fn main() {
    let deserialized: Move = 
        serde_json::from_str(&serialized).unwrap();
}
```

---

## Formats

Serde supports a number of formats, such as:

* JSON
* CBOR
* YAML
* TOML
* BSON
* MessagePack

and more

---

## `Serialize`

```rust
use serde::Serialize;

fn main() {
    let action = Move { id: 1, direction: Direction::West };
    let payload = serde_json::to_string(&action).unwrap();
    println!("{}", payload);
}

#[derive(Debug, Serialize)]
struct Move {
    id: usize,
    direction: Direction,
}

#[derive(Debug, Serialize)]
enum Direction { North, South, East, West }
```

```text
{"id":1,"direction":"West"}
```

---

## `Deserialize`

```rust
use serde::Deserialize;

fn main() {
    let payload = "{\"id\":1,\"direction\":\"West\"}";
    let action = serde_json::from_str::<Move>(&payload);
    println!("{:?}", action);
}

#[derive(Debug, Deserialize)]
struct Move {
    id: usize,
    direction: Direction,
}

#[derive(Debug, Deserialize)]
enum Direction { North, South, East, West }
```

```text
Ok(Move { id: 1, direction: West })
```

----

### Reading directly from a file

Use `from_reader()` to read directly from a file:

```rust
use serde::Deserialize;
use std::fs::File;
use std::io::BufReader;

#[derive(Deserialize, Debug)]
struct Data {
  // ...
}

fn main() {
  // Open the file in read-only mode with buffer.
  let file = File::open("data.json").unwrap();
  let reader = BufReader::new(file);

  // Read the JSON contents of the file as an instance of `Data`.
  let data: Data = serde_json::from_reader(reader).unwrap();
  println!("{:#?}", data);
}
```

---

## Transcode

Deserializing directly into another serializer:

```rust
use serde_transcode::transcode;

fn main() {
    let payload = "{\"id\":1,\"direction\":\"West\"}";
    let mut buffer = String::new();
    {
        let mut ser = toml::Serializer::new(&mut buffer);
        let mut de = serde_json::Deserializer::from_str(&payload);
        transcode(&mut de, &mut ser).unwrap();
    }
    println!("{:?}", buffer);
}
```

```text
id = 1
direction = "West"
```

---

## Attributes

`serde` has a large number of attributes you can utilize:

```rust
#[serde(deny_unknown_fields)] // Be extra strict
struct Move {
    #[serde(default)] // Call usize::default()
    id: usize,
    #[serde(rename = "dir")] // Use a different name
    direction: Direction,
}
```

see https://serde.rs/attributes.html

---

## Exercise

- Save the content of https://api.github.com/emojis
- Parse the content into a `HashMap<String, String>` and then print
  its `Debug` representation

----

```rust
use std::fs::File;
use std::io::BufReader;
use std::collections::HashMap;

fn main() {
  let file = File::open("github.json").unwrap();
  let reader = BufReader::new(file);

  let data: HashMap<String, String> = serde_json::from_reader(reader).unwrap();
  println!("{:#?}", data);
}
```

---

## Exercise

- Save the content of https://pokeapi.co/api/v2/pokemon/42/
- Print the list of `moves` that this Pokémon can learn in the `red-blue`
  version group and at which level it will learn them

----

```rust
use serde::Deserialize;
use std::fs::File;
use std::io::BufReader;

#[derive(Deserialize)]
struct Pokemon {
  moves: Vec<MoveDetails>,
}

#[derive(Deserialize)]
struct MoveDetails {
  // we need to rename here because
  // `move` is a keyword
  #[serde(rename = "move")]
  move_: Move,
  version_group_details: Vec<VersionGroupDetails>,
}

#[derive(Deserialize)]
struct Move {
  name: String,
}

#[derive(Deserialize)]
struct VersionGroupDetails {
  level_learned_at: u32,
  version_group: VersionGroup,
}

#[derive(Deserialize)]
struct VersionGroup {
  name: String,
}

fn main() {
  let file = File::open("pokemon.json").unwrap();
  let reader = BufReader::new(file);

  let pokemon: Pokemon = serde_json::from_reader(reader).unwrap();
  for move_details in pokemon.moves {
    let red_blue = move_details.version_group_details.iter()
            .find(|it| it.version_group.name == "red-blue");

    if let Some(version_group_details) = red_blue {
      let name = move_details.move_.name;
      let level = version_group_details.level_learned_at;
      println!("{name} learned at level {level}");
    }
  }
}
```

---

[Table of Contents](./README.md#/0/3)
