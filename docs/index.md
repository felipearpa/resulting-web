---
title: Home
layout: home
nav_order: 1
---

# Resulting

A Result type for TypeScript/JavaScript based on Kotlin's Result type.
{: .fs-6 .fw-300 }

[Get Started](/resulting-web/getting-started){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View on GitHub](https://github.com/felipearpa/resulting-web){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## Overview

The **Resulting** package provides a `Result` class designed to handle success and failure scenarios in a functional programming style. It encapsulates a result, which can either be a `Success` with a value or a `Failure` with an error, offering methods to safely operate on these results.

| Export | Description |
|:-------|:------------|
| [`Result`](/resulting-web/api/result) | Discriminated union encapsulating a successful value or an error |
| [`runCatching`](/resulting-web/api/run-catching) | Executes a function and wraps the outcome in a `Result` |
| [`isSuccessResult` / `isFailureResult`](/resulting-web/api/type-guards) | Type guard functions for narrowing `Result` types |

## Why a Result type

Handling results effectively is vital in modern software development, especially when dealing with API responses. A `Result` type provides a robust mechanism to manage success and failure scenarios in a predictable and consistent way.

- **Clarity and Explicitness** — The distinction between a successful or failed operation becomes explicit, making your code self-explanatory.
- **Type-Safe Responses** — Strict type safety ensures developers handle both success and failure states, reducing runtime errors.
- **Streamlined Pattern** — Chaining operations such as mapping, transforming, or recovering from errors can be handled elegantly.
- **Consistency Across Codebases** — A uniform schema for results simplifies maintenance and integrations between services.

## Quick Example

```typescript
import { Result, isSuccessResult, isFailureResult } from '@felipearpa/resulting';

const successResult = Result.success('hello');
console.log(successResult.isSuccess); // true

const failureResult = Result.failure(new Error('oops'));
console.log(failureResult.isFailure); // true

if (isSuccessResult(successResult)) {
    console.log(successResult.value); // "hello"
}

if (isFailureResult(failureResult)) {
    console.log(failureResult.error.message); // "oops"
}
```

## Platforms

- Node.js (CommonJS and ES Modules)
- Browser (ES Modules)
- TypeScript (full type definitions included)
