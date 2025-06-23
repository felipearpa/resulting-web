# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### **How to Use This Changelog**
This changelog documents all releases and notable changes. Use this to understand what’s new, improved, or fixed in each version.

---

## [1.3.0] - 2025-06-23


### ✨ New Features

- **Added `mapError` method to `Result`:**
  This method allows transforming the error value of a `Result` without affecting the success value. It's useful for adapting or refining the error before further handling.
  **Example:**
  ```typescript
  const result: Result<number, Error> = Result.failure(Error('Invalid'));
  const refined = result.mapError(error => `Refined: ${error.message}`);
  // Result<number, string> with error = "Refined: Invalid"
  ```

- **Enabled generic error type in `Result<Value, ErrorValue>`:**
  The `Result` class now accepts a second generic parameter to define the error type explicitly. This allows users to model domain-specific errors (like strings or custom types) while maintaining backward compatibility with the default `Error` type.
  **Example:**
  ```typescript
  const result: Result<number, string> = Result.failure('Invalid input');
  ```

- **Added type guard functions `isSuccessResult` and `isFailureResult`:**
  These new functions allow for precise type narrowing when working with `Result` objects, enabling safer access to the underlying `value` or `error` in `Success` and `Failure` instances, respectively.
  **Example:**
  ```typescript
  if (isSuccessResult(result)) {
      console.log(result.value); // Safe to access
  }

  if (isFailureResult(result)) {
      console.error(result.error); // Safe to access
  }
  ```

### 🐞 Bug Fixes

- **Relaxed generic constraint for transformation types:**
  Fixed overly strict generic constraints such as `NewValue extends NonNullable<unknown>` which unnecessarily restricted valid types like `null` or `undefined`. The constraint has been removed to allow broader usage in `map`, `mapCatching`, and related transformation methods.

- **Fixed internal usage of `errorOrNull()` for state detection:**
  Previously, some internal methods used `errorOrNull()` to determine whether a `Result` represented failure or success, which could lead to incorrect behavior when the success `Value` was `null`. These usages have been replaced with `isSuccess` and `isFailure` checks to ensure accurate and type-safe result evaluation.

---

## [1.2.0] - 2025-01-06

### ✨ New Features

- **Added support for object parameter in the `fold` method:**
  The `fold` method now accepts an object with `onSuccess` and `onFailure` handlers as an alternative to the traditional positional parameters. This provides more flexibility and improves code readability when handling both success and failure cases.
  **Example:**

```typescript
const result: Result<number> = Result.success(42);

const transformedResult = result.fold({
    onSuccess: (value) => `Success! The value is ${value}`,
    onFailure: (error) => `Failure! The error is: ${error.message}`,
});

console.log(transformedResult); // Output: Success! The value is 42
```

---

## [1.1.0] - 2024-12-15

### ✨ New Features
- **Added** support for using `Result.success()` without a value, specifically as `Result.success<void>()`, to represent successful operations with no result.

#### Example

```typescript
const result = Result.success(); // Represents a success with no value.
const voidResult = Result.success<void>(); // Explicitly denotes a success with void type.
```

#### Notes

- **Previously** - the only way to create a `Result.success<void>` was using `Result.success<void>(undefined)`.

---

## [1.0.0] - 2024-10-26
### 🚀 Initial Release
- **Introduced** the `Result` type, inspired by Kotlin's `Result` type, for handling success and failure scenarios.
- **Added** `runCatching` function to safely execute code and handle exceptions.
- **Implemented** `map` and `mapCatching` methods to transform successful results and catch errors during transformation.
- **Added** `recover` and `recoverCatching` methods to provide fallback values and handle errors during recovery.
- **Introduced** `getOrElse` and `getOrDefault` methods to retrieve values with defaults in case of failure.
- **Implemented** `fold` method to handle both success and failure cases in one function.
- **Provided** utility methods like `onSuccess` and `onFailure` for executing actions based on the result type.
- **Added** `toString` method to convert the `Result` object to a string representation for easy logging and debugging.
