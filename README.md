# Resulting

The **Resulting** package provides a `Result` class designed to handle success and failure scenarios in a functional programming style. It encapsulates a
result,
which can either be a `Success` with a value or a `Failure` with an error, offering methods to safely operate on these results. This type is based on
the `Kotlin` `Result` type.

## Why a resulting type

Handling results effectively is vital in modern software development, especially when dealing with API responses. A `Result` type provides a robust mechanism to manage success and failure scenarios in a predictable and consistent way. While it can be applied to a variety of use cases, it is particularly suited for structuring API responses. Here’s why:

- **Clarity and Explicitness**: With a `Result` type, the distinction between a successful or failed API operation becomes explicit. Instead of relying on HTTP status codes or custom error-handling mechanisms, your API responses become self-explanatory—clearly defining whether they encapsulate a success or an error.

- **Error Propagation Made Simple**: APIs often need to relay errors back to consumers in a detailed and structured way. The `Result` type encapsulates errors cleanly, allowing developers to propagate and handle errors consistently without introducing ad-hoc patterns.

- **Type-Safe Responses**: Especially in TypeScript, a `Result` type enforces strict type safety. This ensures developers handle both the success and failure states of an API response, reducing the risk of runtime errors caused by improperly handled or unchecked error states.

- **Streamlined Pattern for Operations**: By adopting a `Result` type, API responses become naturally functional and composable. Chaining operations such as mapping, transforming, or recovering from errors can be handled elegantly, allowing developers to build APIs that are both expressive and concise.

- **Consistency Across Codebases**: When APIs return results using a uniform schema, your codebase's consistency improves. Maintenance becomes easier because the same interface can describe both successful results and error states, simplifying integrations between services.

- **Improved Consumer Experience**: For developers consuming your APIs, handling responses structured as a `Result` type becomes straightforward. They don’t need to decipher custom formats or error codes, as the `Result` type inherently conveys all necessary information.

The `Resulting` package makes it straightforward to implement this pattern in your JavaScript or TypeScript projects. By encapsulating both success values and error states within a structured abstraction, it simplifies error handling while encouraging functional programming practices. Its versatility allows it to shine not only in API responses but also in other scenarios where predictable result handling is essential.

### Usage

#### Angular

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = 'https://api.example.com/users';

    constructor(private http: HttpClient) {
    }

    getUser(id: number): Observable<Result<User, Error>> {
        return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
            map(user => Result.success(user)),
            catchError(error => of(Result.failure(Error(`Failed to fetch user: ${error.message}`))))
        );
    }
}
```

#### Using fetch

```typescript
class UserService {
    private readonly apiUrl = 'https://api.example.com/users';

    async getUser(id: number): Promise<Result<User, Error>> {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const user: User = await response.json();
            return Result.success(user);
        } catch (error) {
            return Result.failure(new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
    }
}
```

## Installation

To install the dependencies, use npm or yarn:

```bash
npm install @felipearpa/resulting
```

Or if you’re using yarn:

```bash
yarn install @felipearpa/resulting
```

## Usage

Here’s how you can use the package after installation. You can import the package and use its features like this:

```typescript
import { Result, isSuccessResult, isFailureResult } from '@felipearpa/resulting';

const successResult = Result.success('success result');
console.log(successResult.isSuccess); // Output: true
console.log(successResult.isFailure); // Output: false
if (isSuccessResult(successResult)) {
    console.log(successResult.value); // Output: success result
}

const failureResult = Result.failure(Error('error result'));
console.log(failureResult.isFailure); // Output: true
console.log(failureResult.isSuccess); // Output: false
if (isFailureResult(failureResult)) {
    console.log(failureResult.error); // Output: error result
}
```

## Running Tests

To run tests, use:

```bash
npm run test
```

Jest will automatically detect all test files and run them. For more advanced testing, refer to the [Jest documentation](https://jestjs.io/).

## Contributing

If you would like to contribute, please open a pull request or submit an issue. We are happy to review your changes or ideas!.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software for both personal and commercial use. There
are no
restrictions on usage.

You can now add this section to your README.md to reflect that the project is open source and free to use. Let me know if you’d like to include additional
details!.

## API

### Result class

`Result<Value, ErrorValue = Error>`

A discriminated union that encapsulates a successful outcome with a value of type Value or a failure with an arbitrary error of type ErrorValue.

- #### success

`static success<Value, ErrorValue = Error>(value: Value): Result<Value, ErrorValue>`

Returns an instance that encapsulates the given value as successful value.

```typescript
const result = Result.success('action succeeded');
```

- #### failure

`static failure<Value, ErrorValue = Error>(error: ErrorValue): Result<Value, ErrorValue>`

Returns an instance that encapsulates the given error as failure.

```typescript
const result: Result<string, Error> = Result.failure(Error('action failed'));
```

- #### isSuccess

`isSuccess: boolean`

Returns true if this instance represents a successful outcome. In this case isFailure returns false.

```typescript
const result: Result<string, Error> = Result.success('action succeeded');

if (result.isSuccess) {
    console.log('action succeeded with value: ', result.getOrNull()); // Output: action succeeded with value: action succeeded
} else {
    console.error('action failed with error: ', result.errorOrNull());
}
```

- #### isFailure

`isFailure: boolean`

Returns true if this instance represents a failed outcome. In this case isSuccess returns false.

```typescript
const result: Result<string, Error> = Result.failure(Error('action failed'));

if (result.isSuccess) {
    console.log('action succeeded with value: ', result.getOrNull());
} else {
    console.error('action failed with error: ', result.errorOrNull()); // Output: action failed with error: action failed
}
```

- #### getOrNull

`getOrNull(): Value | null`

Returns the encapsulated value if this instance represents success or null if it is failure.

```typescript
const result = Result.success('action succeeded');

const valueOrNull = result.getOrNull();

if (valueOrNull !== null) {
    console.log('action succeeded with value: ', valueOrNull); // Output: action succeeded with value: action succeeded
} else {
    console.log('action failed, no value available');
}
```

- #### getOrThrow

`getOrThrow(): Value`

Returns the encapsulated value if this instance represents success or throws the encapsulated error if it is failure.

```typescript
const result = Result.success('action succeeded');

try {
    const value = result.getOrThrow();
    console.log('action succeeded with value: ', value); // Output: action succeeded with value: action succeeded
} catch (error) {
    console.error('action failed with error: ', error.message);
}
```

```typescript
const result = Result.failure('action failed');

try {
    const value = result.getOrThrow();
    console.log('action succeeded with value: ', value);
} catch (error) {
    console.error('action failed with error: ', error.message); // Output: action failed with error: action failed
}
```

- #### getOrDefault

`getOrDefault(defaultValue: Value): Value`

Returns the encapsulated value if this instance represents success or the defaultValue if it is failure.

```typescript
const result: Result<string, Error> = Result.failure(Error('action failed'));

const value = result.getOrDefault('default value');

console.log('Result: ', value); // Output: default value
```

- #### getOrElse

`getOrElse<NewValue, Value extends NewValue>(this: Result<Value, ErrorValue>, onFailure: (error: ErrorValue) => NewValue): NewValue`

Returns the encapsulated value if this instance represents success or the result of onFailure function for the encapsulated Error if it is failure.

```typescript
const result: Result<string, Error> = Result.failure(Error('action failed'));

const value = result.getOrElse((error) => {
    console.error('error occurred: ', error.message);
    return 'fallback value';
});

console.log('Result: ', value); // Output: fallback value
```

- #### errorOrNull

`errorOrNull(): ErrorValue | null`

Returns the encapsulated error if this instance represents failure or null if it is success.

```typescript
const result: Result<string, Error> = Result.failure(Error('action failed'));

const error = result.errorOrNull();

if (error !== null) {
    console.error('action failed with error: ', error.message); // Output: action failed with error: action failed
} else {
    console.log('action succeeded');
}
```

- #### map

`map<NewValue>(transform: (value: Value) => NewValue): Result<NewValue, ErrorValue>`

```typescript
const result: Result<number, Error> = Result.success(10);

const transformedResult = result.map(value => value * 2);

if (transformedResult.isSuccess) {
    console.log('transformed value: ', transformedResult.getOrThrow()); // Output: transformed value: 20
} else {
    console.error('action failed');
}
```

- #### mapError

`mapError<NewErrorValue>(transform: (error: ErrorValue) => NewErrorValue): Result<Value, NewErrorValue>`

Returns a new `Result` with the same success value if this instance is successful, or with the error transformed by the provided function if it is a failure.

```typescript
const result: Result<number, Error> = Result.failure(Error('original error'));

const mappedResult = result.mapError(error => `Mapped: ${error.message}`);

if (mappedResult.isFailure) {
    console.error(mappedResult.errorOrNull()); // Output: Mapped: original error
}
```

- #### fold

`fold<NewValue>(onSuccess: (value: Value) => NewValue, onFailure: (error: ErrorValue) => NewValue): NewValue`

`fold<NewValue>(handlers: { onSuccess: (value: Value) => NewValue, onFailure: (error: ErrorValue) => NewValue }): NewValue`

Returns the result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the encapsulated error
if it is failure.

```typescript
const result: Result<number, Error> = Result.success(42);

const transformedResult = result.fold(
    value => `Success! The value is ${value}`,
    error => `Failure! The error is: ${error.message}`
);

console.log(transformedResult); // Output: Success! The value is: 42
```

```typescript
const result: Result<number, Error> = Result.success(42);

const transformedResult = result.fold({
    onSuccess: (value) => `Success! The value is ${value}`,
    onFailure: (error) => `Failure! The error is: ${error.message}`
});

console.log(transformedResult); // Output: Success! The value is: 42
```

```typescript
const result: Result<number, Error> = Result.failure(Error('action failed'));

const transformedResult = result.fold(
    value => `Success! The value is ${value}`,
    error => `Failure! The error is: ${error.message}`
);

console.log(transformedResult); // Output: Failure! The error is: action failed
```

```typescript
const result: Result<number, Error> = Result.failure(Error('action failed'));

const transformedResult = result.fold({
    onSuccess: (value) => `Success! The value is ${value}`,
    onFailure: (error) => `Failure! The error is: ${error.message}`
});

console.log(transformedResult); // Output: Failure! The error is: action failed
```

- #### recover

`recover<NewValue, Value extends NewValue>(this: Result<Value, ErrorValue>, transform: (error: ErrorValue) => NewValue): Result<NewValue, ErrorValue>`

Returns the encapsulated result of the given transform function applied to the encapsulated error if this instance represents failure or the original
encapsulated value if it is success.

```typescript
const result: Result<number, Error> = Result.failure(Error('action failed'));

const recoveredResult = result.recover(error => {
    console.error('Recovering from error:', error.message);
    return 100; // Providing a fallback value
});

if (recoveredResult.isSuccess) {
    console.log('Recovered value: ', recoveredResult.getOrThrow()); // Output: Recovered value: 100
} else {
    console.error('Recovery failed');
}
```

- #### onSuccess

`onSuccess(action: (value: Value) => void): Result<Value, ErrorValue>`

Performs the given action on the encapsulated value if this instance represents success. Returns the original Result unchanged.

```typescript
const result = Result.success('action succeeded');

result.onSuccess(value => {
    console.log('action succeeded with value: ', value); // Output: Operation succeeded with value: action succeeded
});
```

- #### onFailure

`onFailure(action: (error: ErrorValue) => void): Result<Value, ErrorValue>`

Performs the given action on the encapsulated Throwable exception if this instance represents failure. Returns the original Result unchanged.

```typescript
const result: Result<string, Error> = Result.failure(Error('action failed'));

result.onFailure(error => {
    console.error('action failed with error:', error.message); // Output: action failed with error: action failed
});
```

- #### toString

`toString(): string`

Returns a string Success(v) if this instance represents success where v is a string representation of the value or a string Failure(x) if it is failure where x
is a string representation of the error.

```typescript
const successResult = Result.success('action succeeded');
const failureResult: Result<string, Error> = Result.failure(Error('action failed'));

console.log(successResult.toString()); // Output: Success(action succeded)
console.log(failureResult.toString()); // Output: Failure(action failed)
```

- #### mapCatching

`mapCatching<NewValue>(transform: (value: Value) => NewValue): Result<NewValue, ErrorValue>`

Returns the encapsulated result of the given transform function applied to the encapsulated value if this instance represents success or the original
encapsulated error if it is failure.

```typescript
const result: Result<number, Error> = Result.success(10);

const transformedResult = result.mapCatching(value => {
    if (value < 0) {
        throw Error('negative value');
    }
    return value * 2;
});

if (transformedResult.isSuccess) {
    console.log('transformed value: ', transformedResult.getOrThrow()); // Output: transformed value: 20
} else {
    console.error('transformation failed with error: ', transformedResult.errorOrNull()?.message);
}
```

```typescript
const result: Result<number, Error> = Result.success(-10);

const transformedResult = result.mapCatching(value => {
    if (value < 0) {
        throw Error('negative value');
    }
    return value * 2;
});

if (transformedResult.isSuccess) {
    console.log('transformed value: ', transformedResult.getOrThrow());
} else {
    console.error('transformation failed with error: ', transformedResult.errorOrNull()?.message); // Output: transformation failed with error: negative value
}
```

- #### recoverCatching

`recoverCatching<NewValue>(transform: (error: ErrorValue) => NewValue): Result<NewValue, ErrorValue>`

Returns the encapsulated result of the given transform function applied to the encapsulated error if this instance represents failure or the original
encapsulated value if it is success.

```typescript
const result: Result<number, Error> = Result.failure(new Error('initial failure'));

const recoveredResult = result.recoverCatching(error => {
    if (error.message === 'initial failure') {
        throw new Error('recovery failed'); // Simulate a failure during recovery
    }
    return 42; // Recover with a fallback value
});

if (recoveredResult.isSuccess) {
    console.log('recovered value: ', recoveredResult.getOrThrow());
} else {
    console.error('recovery failed with error: ', recoveredResult.errorOrNull()?.message); // Output: recovery failed with error: recovery failed
}
```

```typescript
const result: Result<number, Error> = Result.failure(new Error('final failure'));

const recoveredResult = result.recoverCatching(error => {
    if (error.message === 'initial failure') {
        throw new Error('recovery failed'); // Simulate a failure during recovery
    }
    return 42; // Recover with a fallback value
});

if (recoveredResult.isSuccess) {
    console.log('recovered value: ', recoveredResult.getOrThrow()); // Output: recovered value: 42
} else {
    console.error('recovery failed with error: ', recoveredResult.errorOrNull()?.message);
}
```

---

### runCatching

`const runCatching = <Value>(block: () => Value): Result<Value, Error>`

Calls the specified function block and returns its encapsulated result if invocation was successful, catching any error that was thrown from the block function
execution and encapsulating it as a failure.

```typescript
function riskyOperation(): string {
    if (Math.random() > 0.5) {
        throw Error('something went wrong');
    }
    return 'action succeeded';
}

const result: Result<string, Error> = runCatching(() => riskyOperation());

if (result.isSuccess) {
    console.log('Success:', result.getOrThrow()); // If successful, log the value
} else {
    console.error('Failure:', result.errorOrNull()?.message); // If failure, log the error
}
```

### isSuccessResult

`const isSuccessResult = <Value, ErrorValue>(result: Result<Value, ErrorValue>): result is Success<Value, ErrorValue> => result instanceof Success`

A type guard function that checks if the given result is an instance of the Success class.

```typescript
const result = Result.success('value');
if (isSuccessResult(result)) {
    console.log(result.value); // Output: value
}
```

### isFailureResult

`const isFailureResult = <Value, ErrorValue>(result: Result<Value, ErrorValue>): result is Failure<Value, ErrorValue> => result instanceof Failure`

A type guard function that checks whether a `Result` object is a failure instance.

```typescript
const result = Result.failure(Error('error'));
if (isFailureResult(result)) {
    console.log(result.error.message); // Output: error
}
```
