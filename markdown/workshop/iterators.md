---
title: Iterators
---

# Iterators

aka. the thing that you use with `for` loops

----

## Where Do They Come From?

-   Collections like `Vec<T>` have an `iter()` function which yields an iterator.
-   Things like `std::net::TcpListener` provides an iterator of `TcpStream`s via `incoming()`.
-   Functions like `str#split` and `str#split_n`
-   Iterators can be implemented on other structures as well.

---

## Owned iterators

```rust
fn main() {
    let vec = vec![1, 2, 3];

    // `into_iter()` consumes `vec`
    let iter = vec.into_iter();

    for i in iter {
        println!("{}", i);
    }

    // `vec` is not accessible anymore
}
```

----

## Borrowed iterators

```rust
fn main() {
    let vec = vec![1, 2, 3];

    // `iter()` only borrows `vec`
    let iter = vec.iter();

    for i in iter {
        println!("{}", i);
    }

    // `vec` is available again after `iter` is gone
    println!("{:?}", vec);
}
```

----

## Mutably Borrowed iterators

```rust
fn main() {
    let mut vec = vec![1, 2, 3];

    // `iter_mut()` mutably borrows `vec`
    let iter_mut = vec.iter_mut();

    for i in iter_mut {
        *i += 1
    }

    println!("{:?}", vec); // 2, 3, 4
}
```

----

## Conventions

| Owned        | Borrowed | Mutably borrowed |
|--------------|----------|------------------|
| .into_iter() | .iter()  | .iter_mut()      |

---

## Common Uses

----

### `next()`

Iterators can be advanced manually:

```rust
fn main() {
    let items = vec![0, 1, 2];
    let mut iterator = items.into_iter();
    println!("{:?}", iterator.next());
    println!("{:?}", iterator.next());
    println!("{:?}", iterator.next());
    println!("{:?}", iterator.next());
}
```

Note:
- ask participants what they think this returns
- point out that we see `Some()`s and a `None` here because there's no for loop to unwrap
  the return value of `next()` for us

----

### `map()`

Transform items as they are evaluated:

```rust
fn main() {
    let numbers = (0..10_000)
        .map(|x| 5_000 - x );

    for item in numbers {
        println!("{}", item);
    }
}
```

<small>Unlike in JavaScript, this happens lazily and does  
not create an intermediate new array!</small>

----

### `filter()`

Filter out unwanted values, skipping further computation on them:

```rust
fn main() {
    let evens = (0..10_000)
        .filter(|x| x % 2 == 0);

    for item in evens {
        println!("{}", item);
    }
}
```

----

### `collect()`

Convert an iterator back into a `Vec`:

```rust
fn main() {
    let evens: Vec<_> = (0..10_000)
        .filter(|x| x % 2 == 0)
        .collect();

    println!("{:?}", evens);
}
```

<small>`collect()` uses the [`FromIterator`](https://doc.rust-lang.org/std/iter/trait.FromIterator.html)
trait. It can also be used to create `HashSet`, `HashMap` or other collections.</small>

---

## Ranges

`1..100` contains the numbers 1 to 99.

`1..=100` contains the numbers 1 to 100.

----

Ranges are iterable:

```rust
fn main() {
    for i in 1..=100 {
        println!("{}", i);
    }
}
```

----

Ranges can be used as match patterns:

```rust
fn main() {
    match 42 {
        0..=9 => println!("small number"),
        10..=99 => println!("medium number"),
        _ => println!("BIG number"),
    }
}
```

<small>Inclusive ranges are currently still "experimental".</small>

---

## Exercise

----

**FizzBuzz!**

- print the numbers from 1 to 100
- if the number is divisible by 3, print "fizz" instead
- if the number is divisible by 5, print "buzz" instead
- if the number is divisible by both, print "fizzbuzz" instead

----

```rust
fn main() {
    for n in 1..=100 {
        let fizz = n % 3 == 0;
        let buzz = n % 5 == 0;

        if fizz && buzz {
            println!("fizzbuzz");
        } else if fizz {
            println!("fizz");
        } else if buzz {
            println!("buzz");
        } else {
            println!("{}", n);
        }
    }
}
```

---

## Exercise

```rust
fn factorial(num: u64) -> u64 {
    // --- implement me! ---
}

fn main() {
    println!("{}", factorial(1)); // -> 1
    println!("{}", factorial(2)); // -> 2
    println!("{}", factorial(4)); // -> 24
}
```

<small>Try not to use recursion for this exercise.</small>

----

```rust
fn factorial(num: u64) -> u64 {
    let mut value = 1;
    for x in 1..=num {
        value *= x;
    }
    value
}

fn main() {
    println!("{}", factorial(1)); // -> 1
    println!("{}", factorial(2)); // -> 2
    println!("{}", factorial(4)); // -> 24
}
```

----

Try to find an iterator method that allows us to write this in a shorter way.

```rust
fn factorial(num: u64) -> u64 {
    let mut value = 1;
    for x in 1..=num {
        value *= x;
    }
    value
}

fn main() {
    println!("{}", factorial(1)); // -> 1
    println!("{}", factorial(2)); // -> 2
    println!("{}", factorial(4)); // -> 24
}
```

----

```rust
fn factorial(num: u64) -> u64 {
    (1..=num).fold(1, |acc, x| acc * x)
}

fn main() {
    println!("{}", factorial(1)); // -> 1
    println!("{}", factorial(2)); // -> 2
    println!("{}", factorial(4)); // -> 24
}
```

----

```rust
fn factorial(num: u64) -> u64 {
    (1..=num).product()
}

fn main() {
    println!("{}", factorial(1)); // -> 1
    println!("{}", factorial(2)); // -> 2
    println!("{}", factorial(4)); // -> 24
}
```

---

[Table of Contents](./README.md#/0/2)
