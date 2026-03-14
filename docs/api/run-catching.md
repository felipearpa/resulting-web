---
title: runCatching
layout: default
parent: API Reference
nav_order: 2
---

# runCatching
{: .no_toc }

Calls the specified function block and returns its encapsulated result if invocation was successful, catching any error that was thrown from the block function execution and encapsulating it as a failure.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Signature

```typescript
function runCatching<Value>(block: () => Value): Result<Value, Error>
```

## Usage

### Successful execution

```typescript
import { runCatching } from '@felipearpa/resulting';

const result = runCatching(() => 'hello');

console.log(result.isSuccess); // true
console.log(result.getOrThrow()); // "hello"
```

### Catching errors

```typescript
import { runCatching } from '@felipearpa/resulting';

function riskyOperation(): string {
    if (Math.random() > 0.5) {
        throw new Error('something went wrong');
    }
    return 'action succeeded';
}

const result = runCatching(() => riskyOperation());

if (result.isSuccess) {
    console.log('Success:', result.getOrThrow());
} else {
    console.error('Failure:', result.errorOrNull()?.message);
}
```

### Combining with Result methods

```typescript
import { runCatching } from '@felipearpa/resulting';

const result = runCatching(() => JSON.parse('{"name": "Alice"}'))
    .map(data => data.name.toUpperCase())
    .getOrDefault('UNKNOWN');

console.log(result); // "ALICE"
```

```typescript
import { runCatching } from '@felipearpa/resulting';

const result = runCatching(() => JSON.parse('invalid json'))
    .map(data => data.name.toUpperCase())
    .getOrDefault('UNKNOWN');

console.log(result); // "UNKNOWN"
```

## Error Handling

`runCatching` handles various types of thrown values:

| Thrown Value | Encapsulated Error |
|:-------------|:-------------------|
| `Error` instance | The original `Error` |
| `string` | `new Error(string)` |
| Other object | `new Error(String(object))` |
