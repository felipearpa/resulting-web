---
title: Type Guards
layout: default
parent: API Reference
nav_order: 3
---

# Type Guards
{: .no_toc }

Type guard functions for narrowing `Result` instances to their concrete `Success` or `Failure` types.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## isSuccessResult

```typescript
function isSuccessResult<Value, ErrorValue>(
    result: Result<Value, ErrorValue>
): result is Success<Value, ErrorValue>
```

A type guard that checks if the given result is an instance of `Success`. When `true`, TypeScript narrows the type, giving direct access to the `value` property.

```typescript
import { Result, isSuccessResult } from '@felipearpa/resulting';

const result = Result.success('value');

if (isSuccessResult(result)) {
    console.log(result.value); // "value" — type-safe access
}
```

---

## isFailureResult

```typescript
function isFailureResult<Value, ErrorValue>(
    result: Result<Value, ErrorValue>
): result is Failure<Value, ErrorValue>
```

A type guard that checks if the given result is an instance of `Failure`. When `true`, TypeScript narrows the type, giving direct access to the `error` property.

```typescript
import { Result, isFailureResult } from '@felipearpa/resulting';

const result = Result.failure(new Error('something went wrong'));

if (isFailureResult(result)) {
    console.log(result.error.message); // "something went wrong" — type-safe access
}
```

---

## When to use type guards

Type guards are useful when you need **direct property access** to `value` or `error` rather than using accessor methods like `getOrNull()` or `errorOrNull()`.

```typescript
// Using type guards
if (isSuccessResult(result)) {
    doSomething(result.value); // direct access
}

// Equivalent using accessor methods
const value = result.getOrNull();
if (value !== null) {
    doSomething(value);
}
```

Both approaches are valid. Type guards are particularly helpful in exhaustive checks:

```typescript
function handleResult(result: Result<string, Error>): string {
    if (isSuccessResult(result)) {
        return `Got: ${result.value}`;
    }
    if (isFailureResult(result)) {
        return `Error: ${result.error.message}`;
    }
    return 'Unknown state';
}
```
