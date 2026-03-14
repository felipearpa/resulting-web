---
title: API Reference
layout: default
nav_order: 3
has_children: true
---

# API Reference

The library provides a `Result` class and utility functions for functional error handling.

| Export | Description |
|:-------|:------------|
| [`Result<Value, ErrorValue>`](result) | Discriminated union encapsulating a successful outcome with a value or a failure with an error |
| [`runCatching`](run-catching) | Executes a function block and returns its result, catching any thrown errors |
| [`isSuccessResult` / `isFailureResult`](type-guards) | Type guard functions for narrowing `Result` to `Success` or `Failure` |

All exports are available from the package entry point:

```typescript
import { Result, runCatching, isSuccessResult, isFailureResult } from '@felipearpa/resulting';
```
