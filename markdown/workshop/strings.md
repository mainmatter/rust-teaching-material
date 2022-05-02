---
title: Strings
---

# Strings

---

There are several kinds of strings in Rust.

Most common are `String` and `&str`.

---

## `String`

- *Owns* the data it stores, and can be mutated freely.
- Think of it like a `Vec<char>`:
  - Exists as a pointer to some bytes, a length, and a capacity.
  - Exists on the *heap*.
  - Does not implement `Copy`, but implements `Clone`.

---

## `&str`

-   An immutable reference to a string _slice_.
-   Only seen as a borrowed value.
-   May be anywhere, on the heap, stack, or in program memory.

----

In other words: You can have a `String` "the blue car" and a `&str` "blue" that
points to the same heap memory as the original `String`.

---

## Creation

```rust
fn main() {
    // &'static str
    let static_str = "Hallo";
    
    // String
    let string = String::from("Hallo");
    let string2 = static_str.to_string();
    
    // &str
    let str = that.as_str();
}
```

---

## When to Use What?

- `String` is the *easiest* to use when starting out. Refine later.
- `String` owns its data, so works well as a field of a `struct` or Enum.
- `&'static str` works well for constant values.
- `&str` is typically used in function arguments.

Note: Strings in Rust can be confusing, but if you follow these rules you should
be fine most of the time.

---

## Common String Tasks

----

### Splitting

```rust
fn main() {
    let words = "Cow says moo";
    let each: Vec<_> = words.split(" ").collect();
    println!("{:?}", each);
}
```

----

### Concatenation

```rust
fn main() {
    let animal = String::from("Cow");
    let sound = String::from("moo");
    let words = [&animal, " says ", &sound].concat();
    println!("{:?}", words);
}
```

----

### Replacing

```rust
fn main() {
    let words = "Cow says moo";
    let replaced = words.replace("moo", "roar");
    println!("{}", replaced);
}
```

---

## Exotic String types

-   `OsStr` and `OsString` may show up when working with file systems or system calls.
-   `CStr` and `CString` may show up when working with FFI.

Note: The differences between `[Os|C]Str` and `[Os|C]String` are generally the same as the normal types.

----

### `OsString` & `OsStr`

These types represent *platform native* strings. This is necessary because Unix
and Windows strings have different characteristics.

----

-   Unix strings are often arbitrary non-zero sequences, usually interpreted as UTF-8.
-   Windows strings are often arbitrary non-zero sequences, usually interpreted as UTF-16.
-   Rust strings are always valid UTF-8, and may contain zeros.

`OsString` and `OsStr` bridge this gap and allow for cheap conversion to and
from `String` and `str`.

----

### `CString` & `CStr`

These types represent valid C compatible strings.

They are predominantly used when doing FFI with external code.

It is strongly recommended you read *all* of the documentation on these types before using them.

---

## Quiz

----

This fails to compile. Why? How can we fix it?

```rust
fn main() {
    let answer = current_favorite_color();
    println!("My current favorite color is {}", answer);
}

fn current_favorite_color() -> String {
    "blue"
}
```

---

## Exercise

We have two functions, one accepts a `String` and the other a `&str`:

```rust
fn string(arg: String) {
    println!("{}", arg);
}

fn string_slice(arg: &str) {
    println!("{}", arg);
}
```

----

Replace `???` with either `string()` or `string_slice()` calls:

```rust
fn main() {
    ???("blue");
    ???("red".to_string());
    ???(String::from("hi"));
    ???("rust is fun!".to_owned());
    ???("nice weather".into());
    ???(format!("Interpolation {}", "Station"));
    ???(&String::from("abc")[0..1]);
    ???("  hello there ".trim());
    ???("Happy Monday!".to_string().replace("Mon", "Tues"));
    ???("mY sHiFt KeY iS sTiCkY".to_lowercase());
}
```

----

Solution:

```rust
fn main() {
    string_slice("blue");
    string("red".to_string());
    string(String::from("hi"));
    string("rust is fun!".to_owned());

    // ⬇️ both work
    string_slice("nice weather".into());
    string("nice weather".into());

    string(format!("Interpolation {}", "Station"));
    string_slice(&String::from("abc")[0..1]);
    string_slice("  hello there ".trim());
    string("Happy Monday!".to_string().replace("Mon", "Tues"));
    string("mY sHiFt KeY iS sTiCkY".to_lowercase());
}
```

---

[Table of Contents](./README.md#/0/2)
