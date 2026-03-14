---
title: Result
layout: default
parent: API Reference
nav_order: 1
---

# Result\<Value, ErrorValue\>
{: .no_toc }

A discriminated union that encapsulates a successful outcome with a value of type `Value` or a failure with an arbitrary error of type `ErrorValue` (defaults to `Error`).
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Creating Results

### success

`static success<Value, ErrorValue = Error>(value: Value): Result<Value, ErrorValue>`

Returns an instance that encapsulates the given value as successful value.

```typescript
const result = Result.success('action succeeded');
```

### failure

`static failure<Value, ErrorValue = Error>(error: ErrorValue): Result<Value, ErrorValue>`

Returns an instance that encapsulates the given error as failure.

```typescript
const result: Result<string, Error> = Result.failure(new Error('action failed'));
```

---

## State Checks

### isSuccess

`isSuccess: boolean`

Returns `true` if this instance represents a successful outcome. In this case `isFailure` returns `false`.

```typescript
const result = Result.success('action succeeded');

if (result.isSuccess) {
    console.log('action succeeded with value:', result.getOrNull());
} else {
    console.error('action failed with error:', result.errorOrNull());
}
```

### isFailure

`isFailure: boolean`

Returns `true` if this instance represents a failed outcome. In this case `isSuccess` returns `false`.

```typescript
const result: Result<string, Error> = Result.failure(new Error('action failed'));

if (result.isFailure) {
    console.error('action failed with error:', result.errorOrNull());
}
```

---

## Value Access

### getOrNull

`getOrNull(): Value | null`

Returns the encapsulated value if this instance represents success or `null` if it is failure.

```typescript
const result = Result.success('action succeeded');
const value = result.getOrNull(); // "action succeeded"
```

```typescript
const result: Result<string, Error> = Result.failure(new Error('action failed'));
const value = result.getOrNull(); // null
```

### getOrThrow

`getOrThrow(): Value`

Returns the encapsulated value if this instance represents success or throws the encapsulated error if it is failure.

```typescript
const result = Result.success('action succeeded');
const value = result.getOrThrow(); // "action succeeded"
```

```typescript
const result: Result<string, Error> = Result.failure(new Error('action failed'));
const value = result.getOrThrow(); // throws Error('action failed')
```

### getOrDefault

`getOrDefault(defaultValue: Value): Value`

Returns the encapsulated value if this instance represents success or the `defaultValue` if it is failure.

```typescript
const result: Result<string, Error> = Result.failure(new Error('action failed'));
const value = result.getOrDefault('default value');
console.log(value); // "default value"
```

### getOrElse

`getOrElse<NewValue>(onFailure: (error: ErrorValue) => NewValue): NewValue`

Returns the encapsulated value if this instance represents success or the result of `onFailure` function for the encapsulated error if it is failure.

```typescript
const result: Result<string, Error> = Result.failure(new Error('action failed'));

const value = result.getOrElse(error => {
    console.error('error occurred:', error.message);
    return 'fallback value';
});

console.log(value); // "fallback value"
```

### errorOrNull

`errorOrNull(): ErrorValue | null`

Returns the encapsulated error if this instance represents failure or `null` if it is success.

```typescript
const result: Result<string, Error> = Result.failure(new Error('action failed'));
const error = result.errorOrNull();
console.error(error?.message); // "action failed"
```

```typescript
const result = Result.success('value');
const error = result.errorOrNull(); // null
```

---

## Transformations

### map

`map<NewValue>(transform: (value: Value) => NewValue): Result<NewValue, ErrorValue>`

Returns a new `Result` applying the given transform function to the encapsulated value if this instance represents success, or the original failure unchanged.

```typescript
const result: Result<number, Error> = Result.success(10);
const transformed = result.map(value => value * 2);
console.log(transformed.getOrThrow()); // 20
```

```typescript
const result: Result<number, Error> = Result.failure(new Error('failed'));
const transformed = result.map(value => value * 2);
console.log(transformed.isFailure); // true
```

### mapError

`mapError<NewErrorValue>(transform: (error: ErrorValue) => NewErrorValue): Result<Value, NewErrorValue>`

Returns a new `Result` with the same success value if this instance is successful, or with the error transformed by the provided function if it is a failure.

```typescript
const result: Result<number, Error> = Result.failure(new Error('original error'));
const mapped = result.mapError(error => `Mapped: ${error.message}`);

if (mapped.isFailure) {
    console.error(mapped.errorOrNull()); // "Mapped: original error"
}
```

### mapCatching

`mapCatching<NewValue>(transform: (value: Value) => NewValue): Result<NewValue, ErrorValue>`

Returns the encapsulated result of the given transform function applied to the encapsulated value if this instance represents success, or the original encapsulated error if it is failure. If the transform function throws, the exception is caught and wrapped as a failure.

```typescript
const result: Result<number, Error> = Result.success(10);

const transformed = result.mapCatching(value => {
    if (value < 0) {
        throw new Error('negative value');
    }
    return value * 2;
});

console.log(transformed.getOrThrow()); // 20
```

```typescript
const result: Result<number, Error> = Result.success(-10);

const transformed = result.mapCatching(value => {
    if (value < 0) {
        throw new Error('negative value');
    }
    return value * 2;
});

console.error(transformed.errorOrNull()?.message); // "negative value"
```

### recover

`recover<NewValue>(transform: (error: ErrorValue) => NewValue): Result<NewValue, ErrorValue>`

Returns the encapsulated result of the given transform function applied to the encapsulated error if this instance represents failure, or the original encapsulated value if it is success.

```typescript
const result: Result<number, Error> = Result.failure(new Error('action failed'));

const recovered = result.recover(error => {
    console.error('Recovering from error:', error.message);
    return 100;
});

console.log(recovered.getOrThrow()); // 100
```

### recoverCatching

`recoverCatching<NewValue>(transform: (error: ErrorValue) => NewValue): Result<NewValue, ErrorValue>`

Returns the encapsulated result of the given transform function applied to the encapsulated error if this instance represents failure, or the original encapsulated value if it is success. If the transform function throws, the exception is caught and wrapped as a failure.

```typescript
const result: Result<number, Error> = Result.failure(new Error('initial failure'));

const recovered = result.recoverCatching(error => {
    if (error.message === 'initial failure') {
        throw new Error('recovery failed');
    }
    return 42;
});

console.error(recovered.errorOrNull()?.message); // "recovery failed"
```

```typescript
const result: Result<number, Error> = Result.failure(new Error('final failure'));

const recovered = result.recoverCatching(error => {
    if (error.message === 'initial failure') {
        throw new Error('recovery failed');
    }
    return 42;
});

console.log(recovered.getOrThrow()); // 42
```

### fold

`fold<NewValue>(onSuccess: (value: Value) => NewValue, onFailure: (error: ErrorValue) => NewValue): NewValue`

`fold<NewValue>(handlers: { onSuccess: (value: Value) => NewValue, onFailure: (error: ErrorValue) => NewValue }): NewValue`

Returns the result of `onSuccess` for the encapsulated value if this instance represents success, or the result of `onFailure` for the encapsulated error if it is failure.

```typescript
const result: Result<number, Error> = Result.success(42);

const message = result.fold(
    value => `Success! The value is ${value}`,
    error => `Failure! The error is: ${error.message}`
);

console.log(message); // "Success! The value is 42"
```

Object parameter syntax:

```typescript
const result: Result<number, Error> = Result.success(42);

const message = result.fold({
    onSuccess: value => `Success! The value is ${value}`,
    onFailure: error => `Failure! The error is: ${error.message}`
});

console.log(message); // "Success! The value is 42"
```

---

## Side Effects

### onSuccess

`onSuccess(action: (value: Value) => void): Result<Value, ErrorValue>`

Performs the given action on the encapsulated value if this instance represents success. Returns the original `Result` unchanged for chaining.

```typescript
const result = Result.success('action succeeded');

result.onSuccess(value => {
    console.log('action succeeded with value:', value);
});
// Output: action succeeded with value: action succeeded
```

### onFailure

`onFailure(action: (error: ErrorValue) => void): Result<Value, ErrorValue>`

Performs the given action on the encapsulated error if this instance represents failure. Returns the original `Result` unchanged for chaining.

```typescript
const result: Result<string, Error> = Result.failure(new Error('action failed'));

result.onFailure(error => {
    console.error('action failed with error:', error.message);
});
// Output: action failed with error: action failed
```

---

## Utility

### toString

`toString(): string`

Returns a string `Success(v)` if this instance represents success where `v` is a string representation of the value, or `Failure(x)` if it is failure where `x` is a string representation of the error.

```typescript
const success = Result.success('action succeeded');
console.log(success.toString()); // "Success(action succeeded)"

const failure: Result<string, Error> = Result.failure(new Error('action failed'));
console.log(failure.toString()); // "Failure(action failed)"
```
