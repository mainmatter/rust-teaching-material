---
title: Basic Types
---

# Basic Types

----

What basic types can you think of?

----

Rust has four main primitive types:

- booleans
- integers
- floating-point numbers
- characters

---

## Booleans

----

`true` or `false`

<small>aka. `yes` or `no`</small>

----

```rust
let t = true;

let f: bool = false; // with explicit type annotation
```

---

## Integers

----

Integers are numbers without a fractional component.

----

**Integers:**

0, 1, 13, 42, 1337, -123, 237469281734561827659876878

----

**Not Integers:**

0.0, 1.3, 4.2222, 3.141, -113.75

----

### Built-in Integer types

| Length  | Signed | Unsigned |
|---------|--------|----------|
| 8-bit   | i8     | u8       |
| 16-bit  | i16    | u16      |
| 32-bit  | i32    | u32      |
| 64-bit  | i64    | u64      |
| 128-bit | i128   | u128     |
| ???     | isize  | usize    |

Note: if you really need them, 256- and 512-bit variants exist in third-party
libraries.

----

### Limits

Each integer type has [`MIN`](https://doc.rust-lang.org/std/primitive.i16.html#associatedconstant.MIN)
and [`MAX`](https://doc.rust-lang.org/std/primitive.i16.html#associatedconstant.MAX) constants on it:

```rust
println!("{} -> {}", i16::MIN, i16::MAX);
```

```text
-32768 -> 32767
```

----

### Default type

The default integer type in Rust,  
if you don't specify it explicitly, is: `i32`.

```rust
let x = 42;
let x: i32 = 42; // <- this is equivalent
let x = 42i32; // <- this is also equivalent
```

Note: The type of an integer literal can also be declared by using it as a
suffix to the literal.

----

### Operations

All the usual mathematical operations are supported by the numeric types in Rust:

```rust
let a = 42;
let b = 13 - a;
let c = b * a;
println!("{}", c);
```

```text
-1218
```

---

## Floating-point Numbers

----

Floating-point numbers are numbers **with** a fractional component.

3.14159265359

----

There are two built-in floating-point number types in Rust: `f32` and `f64`

----

Compared to integers, there are no unsigned floating-point numbers in Rust.

----

### Limits

Both float types have [`MIN`](https://doc.rust-lang.org/std/primitive.f32.html#associatedconstant.MIN)
and [`MAX`](https://doc.rust-lang.org/std/primitive.f32.html#associatedconstant.MAX) constants too:

```rust
println!("{}\n-> {}", f32::MIN, f32::MAX);
```

```text
-340282350000000000000000000000000000000
-> 340282350000000000000000000000000000000
```

Other constants like [`INFINITY`](https://doc.rust-lang.org/std/primitive.f32.html#associatedconstant.INFINITY) also exist.

----

### Default type

The default floating-point type in Rust,  
if you don't specify it explicitly, is: `f64`.

```rust
let x = 3.141;
let x: f64 = 3.141; // <- this is equivalent
let x = 3.141f64; // <- this is also equivalent
```

---

## Characters

----

> The char type represents a single character. More specifically, since
> ‘character’ isn’t a well-defined concept in Unicode, char is a
> ‘[Unicode scalar value](https://www.unicode.org/glossary/#unicode_scalar_value)’.

from [https://doc.rust-lang.org/std/](https://doc.rust-lang.org/std/primitive.char.html)

----

> Any Unicode code point except high-surrogate and low-surrogate code points.
> 
> In other words, the ranges of integers `0` to `0xD7FF` and `0xE000` to
> `0x10FFFF` inclusive.

from https://www.unicode.org/glossary/

----

Character literals use single quotes:

```rust
let c = 'z';
let z = 'ℤ';
let heart_eyed_cat = '😻';
```

----

Character literals can be weird:

```rust
let e = 'é'; // works
let e = 'é'; // fails
```

```text
error: character literal may only contain one codepoint
 --> src/lib.rs:2:9
  |
2 | let e = 'é';
  |         ^-^
  |          |
  |          help: consider using the normalized form `\u{e9}` of this character: `é`
  |
note, this `e` is followed by the combining mark `\u{301}`
 --> src/lib.rs:2:10
  |
2 | let e = 'é';
  |          ^
```

----

```rust
let mut chars = "é".chars();
// U+00e9: 'latin small letter e with acute'
assert_eq!(Some('\u{00e9}'), chars.next());
assert_eq!(None, chars.next());

let mut chars = "é".chars();
// U+0065: 'latin small letter e'
assert_eq!(Some('\u{0065}'), chars.next());
// U+0301: 'combining acute accent'
assert_eq!(Some('\u{0301}'), chars.next());
assert_eq!(None, chars.next());
```

----

Don't worry, Rust also has [`String`](https://doc.rust-lang.org/std/string/struct.String.html),
which makes this a lot easier to deal with!

Note: More on that, later!

---

## Type Conversion

<small>aka. Casting</small>

----

Primitive types can be cast from one type to another, though with some
limitations.

----

The `as` keyword must be used for casting between types.

```rust
let decimal = 65.4321_f32;

// casting loses fractional component
let integer = decimal as u8;

// only `u8` can be cast to `char`
let character = integer as char; 

println!("{} -> {} -> {}", decimal, integer, character);
```

```text
Casting: 65.4321 -> 65 -> A
```

----

Implicit type casts are not allowed:

```rust
let decimal = 65.4321_f32;
let integer: u8 = decimal; // `as u8` is missing
```

```text
error[E0308]: mismatched types
 --> src/main.rs:2:19
  |
2 | let integer: u8 = decimal;
  |              --   ^^^^^^^ expected `u8`, found `f32`
  |              |
  |              expected due to this
```

---

## Quiz

----

What type is `123`?

Answer: `i32`
<!-- .element: class="fragment" -->

----

What type is `123.4`?

Answer: `f64`
<!-- .element: class="fragment" -->

----

What type is `123.`?

Answer: `f64`
<!-- .element: class="fragment" -->

----

How can you declare an unsigned 8-bit integer variable?

Answer: `let x: u8`
<!-- .element: class="fragment" -->

----

How can you convert from an 16-bit integer to a floating-point number?

Answer: `let f = i as f32;`
<!-- .element: class="fragment" -->

---

[Table of Contents](./README.md#/0/1)
