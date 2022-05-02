---
title: Compound Types
---

# Compound Types

----

Built into the language:

- [Tuples](https://doc.rust-lang.org/book/ch03-02-data-types.html#the-tuple-type)
- [Structs](https://doc.rust-lang.org/book/ch05-00-structs.html)
- [Enums](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html)

----

From the standard library:

- [`Vec`](https://doc.rust-lang.org/std/vec/struct.Vec.html)
- [`HashMap`](https://doc.rust-lang.org/std/collections/struct.HashMap.html)

---

## Tuples

A Tuple is: something that contains multiple other things.

```rust
// create with `(<field1>, <field2>, <...>)`
// type is: (f64, i32, bool)
let p = (1., 42, true);

// access fields via `.<number>`
println!("{}", p.1);

// "destructuring" is possible too
let (a, b, c) = p; 
```

----

I lied... tuples can also just have one item inside:

```rust
let p = (42,); // type is: (i32)
println!("{}", p.0);
```

<small>The trailing `,` in the parentheses is important. If skipped, the
parentheses would be treated in the mathematical sense.</small>

Note: There is really no point in doing this, but it is possible.

----

There can also be tuples with no items at all:

```rust
let p = ();
```

----

### Unit type

aka. empty tuple:

```rust
fn main() {
    // ...
}

// ⬆️ is equivalent to ⬇️

fn main() -> () {
    // ...
    ()
}
```

<small>The empty tuple is also called "unit type" and is the implicit return
value of any function where no return type is explicitly specified.</small>

Note: this is used roughly similar to `void` in C++ or Java, or `Unit` in Kotlin.

---

## Structs

`struct`s group and name data of different types.

----

### Definition

```rust
struct Point {
    x: i32,
    y: i32,
}
```

----

### Construction

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1, y: 1 };
}
```

<small>All fields must be initialized!</small>

----

### Field Access

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };
    println!("{}", p.x);
    println!("{}", p.y);
}
```

Note:
- no `->` operator for structs behind pointers like in C++, always `.`

----

### Methods

We'll get to that later...

---

## Tuple Structs

```rust
struct Point(i32, i32);

fn main() {
    let p = Point(1, 2);
    println!("{}", p.0);
    println!("{}", p.1);
}
```

<small>Basically a regular `struct`, but without explicit names for its fields.</small>

----

Tuple structs are often used to wrap values as new types:

```rust
struct UnixTimestamp(i64);

fn main() {
    let t = UnixTimestamp(1651821133);
    println!("{}", t.0);
}
```

---

## Quiz

----

How many fields can a tuple have?

Answer: zero, one, or more
<!-- .element: class="fragment" -->

----

What type does the following function return?

```rust
fn greet(name: &str) {
  println!("Hello {}", name);
}
```

Answer: `()` aka. empty tuple aka. unit type
<!-- .element: class="fragment" -->

---

## Enums

`enum`s represent different variation of the same subject.

Note:
- stress that enums are an "either or" type: you can only have one variant at a
  time (you're not accumulating data as with structs)
- stress that you can only have the variants, not the enum itself
  (i.e. `Movement::Left`. but not `Movement`)

----

### Definition and Construction

```rust
enum Direction {
    Right,
    Left,
    Up,
    Down,
}

fn main() {
    let direction = Direction::Left;
}
```

The different choices of Enums are called "variants".

----

## Enums with Values

```rust
enum Movement {
    Right(i32),
    Left(i32),
    Up(i32),
    Down(i32),
}

fn main() {
    let movement = Movement::Left(12);
}
```

----

## Enums with Structured Variants

```rust
enum Actions {
    StayInPlace,
    MoveTo { x: i32, y: i32 },
}

fn main() {
    let action = Actions::MoveTo { x: 1, y: 5 };
}
```

Note:
- each enum variant will be the *worst-case* size! (e.g. the size of its biggest member)

*possible interactive detour:*
- Q: what's the size of `Actions` on bytes?
    - correct A: 12, because we have a tagged union:

    ```pseudo-c
    struct {
        tag: u32 // discriminant is always u32 => 4 bytes
        data: union {
            stick_around: (), // 0 bytes
            move_to: struct { x: i32, y: i32 } // 4 bytes each
        }
    }
    ```

---

## Vec

"A contiguous growable array type"

https://doc.rust-lang.org/std/vec/struct.Vec.html

---

## HashMap

A key-value lookup map

https://doc.rust-lang.org/std/collections/struct.HashMap.html

---

## Quiz

----

How can you access the third element of a `Vec`?

```rust
let el = vec[2]; // may panic

// or

let el = vec.get(2); // returns an `Option<...>`
```
<!-- .element: class="fragment" -->

----

How can you append a new item to a `Vec`?

```rust
let mut vec = Vec::new();
vec.push(the_new_item);
```
<!-- .element: class="fragment" -->

----

How can you remove the fourth element of a `Vec`?

```rust
let mut vec = generate_vec();
vec.remove(3);
```
<!-- .element: class="fragment" -->

---

[Table of Contents](./README.md#/0/1)

Note: Take a break!!?
