/**
 * A class that encapsulates a successful outcome with a value of type Value or a failure with an arbitrary error.
 */
export class Result<Value> {
    /**
     * Returns true if this instance represents a successful outcome. In this case isFailure returns false.
     *
     * @return {boolean} True if this instance represents a successful outcome.
     */
    get isSuccess(): boolean {
        return this instanceof Success;
    }

    /**
     * Returns true if this instance represents a failed outcome. In this case isSuccess returns false.
     *
     * @return {boolean} True if this instance represents a failed outcome.
     */
    get isFailure(): boolean {
        return this instanceof Failure;
    }

    /**
     * Retrieves the value stored in the result.
     * If the result is a success, returns the success value.
     * If the result is a failure, returns the error.
     *
     * @template Value
     * @return {Value | Error} The value from a successful result or the error from a failed result.
     */
    protected get rawValue(): unknown {
        if (this.isSuccess) return (this as unknown as Success<Value>).value;
        return (this as unknown as Failure<Value>).error;
    }

    protected constructor() {}

    /**
     * Returns an instance that encapsulates a successful value.
     *
     * @return {Result<void>} The instance that encapsulates a successful value.
     */
    static success<Value extends void>(): Result<Value>;

    /**
     * Returns an instance that encapsulates the given value as a successful value.
     *
     * @template Value
     * @param {Value} value - The value representing a successful outcome.
     * @returns {Result<Value>} The instance that encapsulates the given value as a successful value.
     */
    static success<Value>(value: Value): Result<Value>;

    static success<Value>(value?: Value extends void ? never : Value): Result<Value> {
        return new Success(value as Value);
    }

    /**
     * Returns an instance that encapsulates the given error as failure.
     *
     * @template Value
     * @param {Error} error - The error representing a failure outcome.
     * @returns {Result<Value>} The instance that encapsulates the given error as failure.
     */
    static failure<Value>(error: Error): Result<Value> {
        return new Failure(error);
    }

    /**
     * Returns the encapsulated value if this instance represents success or null if it is failure.
     *
     * @template Value
     * @return {Value | null} The encapsulated value if this instance represents success or null if it is failure.
     */
    getOrNull(): Value | null {
        if (this.isSuccess) {
            return this.rawValue as Value;
        }
        return null;
    }

    /**
     * Returns the encapsulated value if this instance represents success or throws the encapsulated error if it is failure.
     *
     * @template Value
     * @return {Value} The encapsulated value if this instance represents success or throws the encapsulated error if it is failure.
     */
    getOrThrow(): Value {
        if (this.isFailure) throw this.rawValue as Error;
        return this.rawValue as Value;
    }

    /**
     * Returns the encapsulated value if this instance represents success or the defaultValue if it is failure.
     *
     * @template Value
     * @template NewValue
     * @param {Value} defaultValue - The default value to return if 'this.result' is not defined.
     * @return {Value} The encapsulated value if this instance represents success or the defaultValue if it is failure.
     */
    getOrDefault(defaultValue: Value): Value {
        const value = this.getOrNull();
        if (value != null) {
            return value as Value;
        }
        return defaultValue;
    }

    /**
     * Returns the encapsulated value if this instance represents success or the result of onFailure function for the encapsulated Error if it is failure.
     *
     * @template NewValue
     * @param {(Error) => NewValue} onFailure - A function that accepts an error and returns a new value.
     * @return {NewValue} The encapsulated value if this instance represents success or the result of onFailure function for the encapsulated Error if it is
     * failure.
     */
    getOrElse<NewValue, Value extends NewValue>(this: Result<Value>, onFailure: (error: Error) => NewValue): NewValue {
        const error = this.errorOrNull();
        if (error == null) {
            return this.rawValue as Value;
        }
        return onFailure(error);
    }

    /**
     * Returns the encapsulated error if this instance represents failure or null if it is success.
     *
     * @return {Error | null} The encapsulated error if this instance represents failure or null if it is success.
     */
    errorOrNull(): Error | null {
        if (this.isFailure) return this.rawValue as Error;
        return null;
    }

    /**
     * Returns the encapsulated result of the given transform function applied to the encapsulated value if this instance represents success or the original
     * encapsulated error if it is failure.
     *
     * @template Value
     * @template NewValue
     * @param {(Value) => NewValue} transform - A function that takes a value of type Value and returns a new value of type NewValue.
     * @return {Result<NewValue>} The encapsulated result of the given transform function applied to the encapsulated value if this instance represents success
     * or the original encapsulated error if it is failure.
     */
    map<NewValue>(transform: (value: Value) => NewValue): Result<NewValue> {
        if (this.isSuccess) return Result.success(transform(this.rawValue as Value));
        return Result.failure(this.rawValue as Error);
    }

    /**
     * Returns the result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the encapsulated
     * error if it is failure.
     *
     * @template Value
     * @template NewValue
     * @param {(Value) => NewValue} onSuccess - A function to handle the successful result, taking the result value as an argument and returning a new value.
     * @param {(Error) => NewValue} onFailure - A function to handle the failure result, taking the error value as an argument and returning a new value.
     * @return {NewValue} The result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the
     * encapsulated error if it is failure.
     */
    fold<NewValue>(onSuccess: (value: Value) => NewValue, onFailure: (error: Error) => NewValue): NewValue;

    /**
     * Returns the result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the encapsulated
     * error if it is failure.
     *
     * @template Value
     * @template NewValue
     * @param {Object} handlers - An object containing the functions to handle success and failure states.
     * @param {(Value) => NewValue} handlers.onSuccess - Function to process the successful value.
     * @param {(Error) => NewValue} handlers.onFailure - Function to process the error value.
     * @return {NewValue} The result of the executed handler function.
     */
    fold<NewValue>(handlers: { onSuccess: (value: Value) => NewValue; onFailure: (error: Error) => NewValue }): NewValue;

    fold<NewValue>(
        handlers:
            | {
                  onSuccess: (value: Value) => NewValue;
                  onFailure: (error: Error) => NewValue;
              }
            | ((value: Value) => NewValue),
        onFailure?: (error: Error) => NewValue,
    ): NewValue {
        if (typeof handlers === 'object') {
            const { onSuccess, onFailure } = handlers;
            return this.fold(onSuccess, onFailure);
        }

        if (this.isSuccess) return (handlers as (value: Value) => NewValue)((this as unknown as Success<Value>).value);
        return (onFailure as (error: Error) => NewValue)((this as unknown as Failure<Value>).error);
    }

    /**
     * Returns the encapsulated result of the given transform function applied to the encapsulated error if this instance represents failure or the original
     * encapsulated value if it is success.
     * @template Value
     * @template NewValue
     * @param {(Error) => NewValue} transform - A function that takes an Error as input and returns a new value.
     * @return {Result<NewValue>} The encapsulated result of the given transform function applied to the encapsulated error if this instance represents
     * failure or the original encapsulated value if it is success.
     */
    recover<NewValue, Value extends NewValue>(this: Result<Value>, transform: (error: Error) => NewValue): Result<NewValue> {
        const error = this.errorOrNull();
        if (error == null) {
            return this;
        }
        return Result.success(transform(error));
    }

    /**
     * Performs the given action on the encapsulated value if this instance represents success. Returns the original Result unchanged.
     *
     * @template Value
     * @param {(Value) => void} action - The callback function to be executed if the result is successful.
     * @return {Result<Value>} The original Result unchanged.
     */
    onSuccess(action: (value: Value) => void): Result<Value> {
        if (this.isSuccess) action(this.rawValue as Value);
        return this;
    }

    /**
     * Performs the given action on the encapsulated Throwable exception if this instance represents failure. Returns the original Result unchanged.
     *
     * @template Value
     * @param {(Error) => void} action - The callback function to be executed if the result is failure.
     * @return {Result<Value>} The original Result unchanged.
     */
    onFailure(action: (error: Error) => void): Result<Value> {
        if (this.isFailure) action(this.rawValue as Error);
        return this;
    }

    /**
     * Returns a string Success(v) if this instance represents success where v is a string representation of the value or a string Failure(x) if it is failure
     * where x is a string representation of the error.
     *
     * @return A string Success(v) if this instance represents success where v is a string representation of the value or a string Failure(x) if it is failure
     * where x is a string representation of the error.
     */
    toString(): string {
        return String(this.rawValue);
    }
}

/**
 * A class representing a successful result.
 *
 * @template Value - The type of the value contained in the success result.
 */
class Success<Value> extends Result<Value> {
    constructor(public readonly value: Value) {
        super();
    }
}

/**
 * A class that represents a failure result.
 *
 * @template Value The type of the value that would have been returned in case of success.
 */
class Failure<Value> extends Result<Value> {
    constructor(public readonly error: Error) {
        super();
    }
}

/**
 * A type guard function that checks if the given result is an instance of the Success class.
 *
 * @template Value
 * @param {Result<Value>} result - The result object to be checked.
 * @returns {result is Success<Value>} Returns true if the result is an instance of Success, otherwise false.
 */
export const isSuccessResult = <Value>(result: Result<Value>): result is Success<Value> => result instanceof Success;

/**
 * A type guard function that checks whether a `Result` object is a failure instance.
 *
 * @template Value - The type parameter representing the value wrapped by the `Result`.
 * @param {Result<Value>} result - The `Result` object to be checked.
 * @returns {boolean} - Returns `true` if the given `result` is an instance of `Failure`, otherwise `false`.
 */
export const isFailureResult = <Value>(result: Result<Value>): result is Failure<Value> => result instanceof Failure;
