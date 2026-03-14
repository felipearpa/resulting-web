---
title: Getting Started
layout: default
nav_order: 2
---

# Getting Started
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Installation

Install via npm:

```bash
npm install @felipearpa/resulting
```

Or using yarn:

```bash
yarn add @felipearpa/resulting
```

## Basic Usage

```typescript
import { Result } from '@felipearpa/resulting';

const success = Result.success('action succeeded');
console.log(success.isSuccess); // true
console.log(success.getOrNull()); // "action succeeded"

const failure = Result.failure(new Error('action failed'));
console.log(failure.isFailure); // true
console.log(failure.errorOrNull()?.message); // "action failed"
```

## Usage with Angular

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = 'https://api.example.com/users';

    constructor(private http: HttpClient) {}

    getUser(id: number): Observable<Result<User, Error>> {
        return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
            map(user => Result.success(user)),
            catchError(error =>
                of(Result.failure(new Error(`Failed to fetch user: ${error.message}`)))
            )
        );
    }
}
```

## Usage with fetch

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
            return Result.failure(
                new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`)
            );
        }
    }
}
```

## Chaining Operations

`Result` methods return new `Result` instances, enabling fluent chaining:

```typescript
const result: Result<number, Error> = Result.success(10);

const output = result
    .map(value => value * 2)
    .onSuccess(value => console.log('Doubled:', value))
    .getOrDefault(0);

console.log(output); // 20
```

## Error Recovery

```typescript
const result: Result<number, Error> = Result.failure(new Error('not found'));

const recovered = result.recover(error => {
    console.error('Recovering from:', error.message);
    return 100;
});

console.log(recovered.getOrThrow()); // 100
```

## Pattern Matching with fold

```typescript
const result: Result<number, Error> = Result.success(42);

const message = result.fold(
    value => `Success! The value is ${value}`,
    error => `Failure! ${error.message}`
);

console.log(message); // "Success! The value is 42"
```

Or using the object parameter syntax:

```typescript
const message = result.fold({
    onSuccess: value => `Success! The value is ${value}`,
    onFailure: error => `Failure! ${error.message}`
});
```

## Custom Error Types

`Result` supports generic error types beyond the default `Error`:

```typescript
type ApiError = { code: number; message: string };

const result: Result<string, ApiError> = Result.failure({ code: 404, message: 'Not found' });

if (result.isFailure) {
    const error = result.errorOrNull();
    console.error(`Error ${error?.code}: ${error?.message}`);
}
```

## Safe Execution with runCatching

```typescript
import { runCatching } from '@felipearpa/resulting';

function riskyOperation(): string {
    if (Math.random() > 0.5) {
        throw new Error('something went wrong');
    }
    return 'action succeeded';
}

const result = runCatching(() => riskyOperation());

result
    .onSuccess(value => console.log('Success:', value))
    .onFailure(error => console.error('Failure:', error.message));
```
