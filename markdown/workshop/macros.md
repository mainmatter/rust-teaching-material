---
title: Macros
---

# Macros

aka. Metaprogramming

aka. "why are there `!` in my function calls?"

----

Macros come in one of three flavors:

- Function-like macros: `custom!(...)`
- Derive macros: `#[derive(CustomDerive)]`
- Attribute macros: `#[CustomAttribute]`

----

Think of a macro as a compile-time function:

`f(code) -> code`

----

Macros can be used to things such as:

* Generate repetitive code.
* Create DSLs.
* Write things that would otherwise be hard without Macros.

Note: DSL = Domain Specific Language

----

Macros are:

* **Hygienic**, expansion happens in a different 'syntax context'
* **Correct**, they cannot expand to invalid code.
* **Limited**, they cannot, for example, pollute their expansion site.

---

## Function-like macros

A macro has three parts:

* A name, eg. `println`.
* A input portion, defining what the macro accepts.
* An output portion, defining how it expands.

Note: In other words: Roughly like a function but slightly more flexible.

----

### Important Function-like Macros

- `println!(pattern, [values])`  
  Easy printing of formatted strings to stdout
- `format!(pattern, [values])`  
  like `println!`, but returns Strings
- `write!(buf, pattern, [values])`  
  Simple writing of formatted data to a `&mut Write`
- `vec![...]`  
  Creating a new `Vec`

----

### Syntax

Let's see how they look like:

```rust
macro_rules! double { 
  // Input parameters
  ($value:expr)
  =>
  // Output
  ($value * 2);
}

fn main() {
    let doubled = double!(5);
    println!("{}", doubled);

    // Alternatives:
    double! { 5 };
    double![5];
}
```

Note:
- `macro_rules!` declares a new declarative macro
- `double` is the name of the macro
- `=>` separator is used between input and output

----

```rust
macro_rules! double { 
  // Input parameters
  ($value:expr)
  =>
  // Output
  ($value * 2);
}
```

The `($value:expr)` part says that: 
**The macro accepts one parameter which is an expression.**

Parameter types can be restricted. For example, `$foo:ty` only accepts a type.

----

```rust
macro_rules! double { 
  // Input parameters
  ($value:expr)
  =>
  // Output
  ($value * 2);
}
```

The parameters are prepended with a `$` to distinguish them.

Both in the input and output.

----

### Repetitions

```rust
macro_rules! implement_foo_for {
    [
        // This is a repetition!
        $($implement_for:ty,)*
    ] => {
        // This iterates over the repetition!
        $(impl Foo for $implement_for {})*
    }
}

implement_foo_for![u8, u16, u32, u64, usize,];
implement_foo_for! { i8, i16, i32, i64, isize, }
implement_foo_for!(f32, f64,);

trait Foo {
    fn foo(&self) {
        println!("Foo!");
    }
}

fn main() {
    1_u8.foo();
    1_u16.foo();
}
```

----

```rust
macro_rules! implement_foo_for {
    [
        // This is a repetition!
        $($implement_for:ty,)*
    ] => {
        // This iterates over the repetition!
        $(impl Foo for $implement_for {})*
    }
}
```

When we see `$(...)*` this is signalling a repetition. It communicates:

**This portion of the macro takes a variable number of arguments.**

Each repetition in the input should have a matching one in the output.

Note: The `*` is inherited from regular expressions and means 0..n. `+` and `?`
also exist.

----

### Custom Syntax

Macros allow for a limited form of custom syntax and can be used to build simple DSLs:

```rust
macro_rules! email {
    ($user:expr => $domain:expr) => {
        format!("{}@{}", $user, $domain);
    }
}

fn main() {
    let address = email!("me" => "example.org");
    println!("{}", address);
}
```

----

### Real life example

[https://docs.rs/claim/](https://docs.rs/claim/0.5.0/src/claim/assert_ok.rs.html#54-74)

---

## Procedural Macros

Derive macros and attribute macros must be defined in a dedicated crate with the
`proc-macro` option:

```toml
[lib]
proc-macro = true
```

----

### Example

```rust
extern crate proc_macro;
use proc_macro::TokenStream;

#[proc_macro]
pub fn make_answer(_item: TokenStream) -> TokenStream {
    "fn answer() -> u32 { 42 }".parse().unwrap()
}
```

----

You can find more information on procedural macro creation in the
[Rust Book](https://doc.rust-lang.org/book/ch19-06-macros.html#procedural-macros-for-generating-code-from-attributes).

---

## Downsides of Macros

- Can be difficult to debug.
- Can be confusing to read and understand.

---

## When Should You Use Macros?

- Use macros where there are no other good alternatives.
- Avoid overusing macros.

---

## Debugging

[cargo-expand](https://github.com/dtolnay/cargo-expand) prints out the result
of macro expansions, making it easier to understand what the resulting code
looks like.

----

`cargo install` installs Rust applications from crates.io:

```shell
$ cargo install cargo-expand
    Updating crates.io index
  Downloaded cargo-expand v1.0.21
  Downloaded 1 crate (22.7 KB) in 0.45s
  Installing cargo-expand v1.0.21
   Compiling proc-macro2 v1.0.38
   Compiling syn v1.0.94
   ...
   Compiling cargo-expand v1.0.21
    Finished release [optimized] target(s) in 1m 32s
   Installing /Users/tbieniek/.cargo/bin/cargo-expand
    Installed package `cargo-expand v1.0.21` (executable `cargo-expand`)
```

<small>Any globally installed binary `cargo-foo` can also  
be called as if it was a native cargo command: `cargo foo`.</small>

----

`cargo expand` on:

```rust
#[derive(Debug)]
struct S;

fn main() {
    println!("{:?}", S);
}
```
----

expands to:

```rust
#![feature(prelude_import)]
#[prelude_import]
use std::prelude::v1::*;
#[macro_use]
extern crate std;
struct S;
#[automatically_derived]
#[allow(unused_qualifications)]
impl ::core::fmt::Debug for S {
    fn fmt(&self, f: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
        match *self {
            S => {
                let mut debug_trait_builder = f.debug_tuple("S");
                debug_trait_builder.finish()
            }
        }
    }
}
fn main() {
    {
        ::std::io::_print(::core::fmt::Arguments::new_v1(
            &["", "\n"],
            &match (&S,) {
                (arg0,) => [::core::fmt::ArgumentV1::new(arg0, ::core::fmt::Debug::fmt)],
            },
        ));
    };
}
```

<!-- .element: height="400" -->

---

[Table of Contents](./README.md#/0/3)
