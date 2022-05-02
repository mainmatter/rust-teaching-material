---
title: Variables
---

# Variables

---

```rust
let x;
```

`let` declares a new variable.

----

```rust
let x; // declare "x"
x = 42; // assign 42 to "x"
```

Assignments can only happen after a variable has been declared.

----

```rust
let x;
foobar(x); 
x = 42;
```

```text
error[E0381]: use of possibly-uninitialized variable: `x`
 --> src/main.rs:2:8
  |
2 | foobar(x); 
  |        ^ use of possibly-uninitialized `x`
```

----

```rust
let x = 42;
```

Declaration and assignment can also be written in one line.

----

```rust
let x: i32 = 42;
```

Variables can have an explicit type.

In this case: a 32-bit signed integer.

----

The type of variable is inferred from the assignment, if possible and no
explicit type was declared.

---

## Unused variables

----

Rust automatically warns about unused variables, functions, properties, etc.

----

```rust
let x = 42;
```

```text
warning: unused variable: `x`
 --> src/main.rs:1:5
  |
1 | let x = 42;
  |     ^ help: if this is intentional, prefix it with an underscore: `_x`
```

----

Variables with an underscore prefix are ignored by the unused variable checker.

```rust
let x = 42;  // <- warning
let _x = 42; // <- no warning
```

Note: Why would you intentionally have a variable but not use it?
"Guards". We'll get to that later.

---

## Shadowing

----

```rust
let x = 42;
let x = x + 13;
// using `x` after that line only refers to the second `x`,
// the first `x` no longer exists.
```

Separate variables with the same name can be introduced – you can shadow a variable binding.

----

Think of it like this:

```rust
let x_001 = 42;
let x_002 = x_001 + 13;
```

This is essentially what the compiler does internally.

---

## Scope

----

What is the output?

```rust
fn main() {
    let x = 42;
    println!("{}", x);

    if something {
        let x = 13;
        println!("{}", x);
    }

    println!("{}", x);
}
```

```text
42
13
42
```

<!-- .element: class="fragment" -->

---

## Mutability

----

Variables in Rust are immutable by default!

----

Roughly Like `const` in C++, `val` in Kotlin, and `const` in JavaScript.

----

```rust
let x = 42;
x = 13;
```

```text
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:1:1
  |
1 | let x = 42;
  |     -
  |     |
  |     first assignment to `x`
  |     help: consider making this binding mutable: `mut x`
2 | x = 13;
  | ^^^^^^ cannot assign twice to immutable variable
```

<!-- .element: class="fragment" -->

----

`let mut` declares a mutable variable.

```rust
let mut x = 42;
x = 13;
```

----

Variable binding **and variable content** are immutable!

----

In JavaScript `const` only means that the variable binding is immutable,
but the content can change.

```js
class Foo {
    constructor(bar) {
        this.bar = bar;
    }
}

const foo = new Foo(42);
foo.bar = 13;
```

----

In Rust the content is also immutable.

```rust
struct Foo {
    bar: i32,
}

let foo = Foo { bar: 42 };
foo.bar = 13;
```

```text
error[E0594]: cannot assign to `foo.bar`, as `foo` is not declared as mutable
 --> src/main.rs:5:1
  |
5 | let foo = Foo { bar: 42 };
  |     --- help: consider changing this to be mutable: `mut foo`
6 | foo.bar = 13;
  | ^^^^^^^^^^^^ cannot assign
```

<!-- .element: class="fragment" -->

Note: Just like before, we can solve this with the `mut` keyword.

---

## Constants

----

`let != const`

Rust also has constants, which are different from immutable variables.

----

Constants can be used for values that are known at compile-time.

----

`const` declares a constant.

```rust
const PI: f32 = 3.14159265359;
```

Note: there is also `static`, but let's not worry about that for now…

----

Constants **always** need an explicit type declaration!

```rust
const PI = 3.14159265359;
```

```text
error: missing type for `const` item
 --> src/main.rs:1:7
  |
1 | const PI = 3.14159265359;
  |       ^^ help: provide a type for the constant: `PI: f64`
```

----

Calculations are also possible to a certain degree.

```rust
const ONE_HOUR_IN_MS: u32 = 60 * 60 * 1000;
```

Note: These calculations happen at compile-time, not run-time!

---

## Quiz

----

What three types of variables exist in Rust?

- Immutable
- Mutable
- Constants

<!-- .element: class="fragment" -->

----

Why does this fail to compile?

```rust
fn main() {
    let x: i32;
    println!("Number {}", x);
}
```

```text
error[E0381]: borrow of possibly-uninitialized variable: `x`
 --> src/main.rs:3:27
  |
3 |     println!("Number {}", x);
  |                           ^ use of possibly-uninitialized `x`
  |
```

<!-- .element: class="fragment" -->

----

How can we fix this?

```rust
fn main() {
    let number = "T-H-R-E-E"; // don't change this line
    println!("Spell a Number : {}", number);
    number = 3;
    println!("Number plus two is : {}", number + 2);
}
```

----

What is wrong here?

```rust
const NUMBER = 3;

fn main() {
    println!("Number {}", NUMBER);
}
```

---

[Table of Contents](./README.md#/0/1)
