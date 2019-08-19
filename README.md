## ecs

[![Build Status](https://travis-ci.org/jakeklassen/ecs.svg?branch=master)](https://travis-ci.org/jakeklassen/ecs)

TypeScript Entity Component System.

## Benchmarks

**Test Machine**

```
OS: Ubuntu 18.04.2 LTS on Windows 10 x86_64
Kernel: 4.19.57-microsoft-standard
CPU: Intel i7-4710HQ (8) @ 2.494GHz
Memory: 16GB
```

### Node 12.8.0

> `World#view()` @ `100_000` entities with `100` components each x `1,213 ops/sec ±0.91%` (89 runs sampled)
> `World#findEntity()` @ `100_000` entities with `100` components each x `2,119 ops/sec ±1.07%` (85 runs sampled)

## Recognitions

- [fast-bitset](https://www.npmjs.com/package/fast-bitset)

## Roadmap

- Event System
- More tests
- Benchmarks
- More examples
