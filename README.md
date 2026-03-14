# Resulting

A Result type for TypeScript/JavaScript based on Kotlin's Result type.

## Overview

The **Resulting** package provides a `Result` class designed to handle success and failure scenarios in a functional programming style. It encapsulates a result, which can either be a `Success` with a value or a `Failure` with an error.

- **`Result<Value, ErrorValue>`** — Discriminated union for success/failure handling
- **`runCatching`** — Safe execution wrapper that catches errors into a `Result`
- **`isSuccessResult` / `isFailureResult`** — Type guards for narrowing `Result` types

## Platforms

- Node.js (CommonJS and ES Modules)
- Browser (ES Modules)
- TypeScript (full type definitions included)

## Installation

```bash
npm install @felipearpa/resulting
```

Or using yarn:

```bash
yarn add @felipearpa/resulting
```

## Quick Example

```typescript
import { Result, runCatching, isSuccessResult } from '@felipearpa/resulting';

const result = Result.success('hello');
console.log(result.isSuccess); // true

const mapped = result.map(value => value.toUpperCase());
console.log(mapped.getOrThrow()); // "HELLO"

const safe = runCatching(() => JSON.parse('invalid'));
console.log(safe.isFailure); // true
console.log(safe.getOrDefault({})); // {}
```

## Documentation

Full documentation is available at the [project site](https://felipearpa.github.io/resulting-web/).

## Contributing

If you would like to contribute, please open a pull request or submit an issue. We are happy to review your changes or ideas!

## License

This project is licensed under the [MIT License](LICENSE).
