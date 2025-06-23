/**
 * A class that encapsulates a successful outcome with a value of type Value or a failure with an arbitrary error.
 */
export class Result<Value, ErrorValue = Error> {
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
     * @return {unknown} The value from a successful result or the error from a failed result.
     */
    protected get rawValue(): unknown {
        if (this.isSuccess) return (this as unknown as Success<Value, ErrorValue>).value;
        return (this as unknown as Failure<Value, ErrorValue>).error;
    }

    protected constructor() {}

    /**
     * Returns an instance that encapsulates a successful value.
     *
     * @template Value
     * @template ErrorValue
     * @return {Result<void, ErrorValue>} The instance that encapsulates a successful value.
     */
    static success<Value extends void, ErrorValue = Error>(): Result<Value, ErrorValue>;

    /**
     * Returns an instance that encapsulates the given value as a successful value.
     *
     * @template Value
     * @template ErrorValue
     * @param {Value} value - The value representing a successful outcome.
     * @returns {Result<Value, ErrorValue>} The instance that encapsulates the given value as a successful value.
     */
    static success<Value, ErrorValue = Error>(value: Value): Result<Value, ErrorValue>;

    static success<Value, ErrorValue = Error>(value?: Value extends void ? never : Value): Result<Value, ErrorValue> {
        return new Success<Value, ErrorValue>(value as Value);
    }

    /**
     * Returns an instance that encapsulates a failure value.
     *
     * @template Value
     * @template ErrorValue
     * @return {Result<Value, ErrorValue>} A `Result` instance representing failure with the provided error.
     */
    static failure<Value extends void, ErrorValue extends void>(): Result<Value, ErrorValue>;

    /**
     * Returns an instance that encapsulates the given error as a failure value.
     *
     * @template Value
     * @template ErrorValue
     * @param {ErrorValue} error - The error value to be encapsulated in the result.
     * @return {Result<Value, ErrorValue>} A `Result` instance representing failure with the provided error.
     */
    static failure<Value = void, ErrorValue = Error>(error: ErrorValue): Result<Value, ErrorValue>;

    static failure<Value = void, ErrorValue = Error>(error?: ErrorValue extends void ? never : ErrorValue): Result<Value, ErrorValue> {
        return new Failure<Value, ErrorValue>(error as ErrorValue);
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
     * @template ErrorValue
     * @param {(ErrorValue) => NewValue} onFailure - A function that accepts an error and returns a new value.
     * @return {NewValue} The encapsulated value if this instance represents success or the result of onFailure function for the encapsulated Error if it is
     * failure.
     */
    getOrElse<NewValue, Value extends NewValue>(this: Result<Value, ErrorValue>, onFailure: (error: ErrorValue) => NewValue): NewValue {
        const error = this.errorOrNull();
        if (error == null) {
            return this.rawValue as Value;
        }
        return onFailure(error);
    }

    /**
     * Returns the encapsulated error if this instance represents failure or null if it is success.
     *
     * @template ErrorValue
     * @return {ErrorValue | null} The encapsulated error if this instance represents failure or null if it is success.
     */
    errorOrNull(): ErrorValue | null {
        if (this.isFailure) return this.rawValue as ErrorValue;
        return null;
    }

    /**
     * Returns the encapsulated result of the given transform function applied to the encapsulated value if this instance represents success or the original
     * encapsulated error if it is failure.
     *
     * @template Value
     * @template NewValue
     * @template ErrorValue
     * @param {(Value) => NewValue} transform - A function that takes a value of type Value and returns a new value of type NewValue.
     * @return {Result<NewValue, ErrorValue>} The encapsulated result of the given transform function applied to the encapsulated value if this instance represents success
     * or the original encapsulated error if it is failure.
     */
    map<NewValue>(transform: (value: Value) => NewValue): Result<NewValue, ErrorValue> {
        if (this.isSuccess) return Result.success(transform(this.rawValue as Value));
        return Result.failure(this.rawValue as ErrorValue);
    }

    /**
     * Returns the encapsulated result of the given transform function applied to the encapsulated value if this instance represents failure or the original
     * encapsulated value if it is success.
     *
     * @template Value
     * @template ErrorValue
     * @template NewErrorValue
     * @param {function(ErrorValue): NewErrorValue} transform - A function that takes a value of type ErrorValue and returns a new value of type NewErrorValue.
     * @return {Result<Value, NewErrorValue>} The encapsulated result of the given transform function applied to the encapsulated value if this instance represents failure
     * or the original encapsulated value if it is success.
     */
    mapError<NewErrorValue>(transform: (error: ErrorValue) => NewErrorValue): Result<Value, NewErrorValue> {
        if (this.isFailure) return Result.failure(transform(this.rawValue as ErrorValue));
        return Result.success(this.rawValue as Value);
    }

    /**
     * Returns the result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the encapsulated
     * error if it is failure.
     *
     * @template Value
     * @template NewValue
     * @template ErrorValue
     * @param {(Value) => NewValue} onSuccess - A function to handle the successful result, taking the result value as an argument and returning a new value.
     * @param {(ErrorValue) => NewValue} onFailure - A function to handle the failure result, taking the error value as an argument and returning a new value.
     * @return {NewValue} The result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the
     * encapsulated error if it is failure.
     */
    fold<NewValue>(onSuccess: (value: Value) => NewValue, onFailure: (error: ErrorValue) => NewValue): NewValue;

    /**
     * Returns the result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the encapsulated
     * error if it is failure.
     *
     * @template Value
     * @template NewValue
     * @template ErrorValue
     * @param {Object} handlers - An object containing the functions to handle success and failure states.
     * @param {(Value) => NewValue} handlers.onSuccess - Function to process the successful value.
     * @param {(ErrorValue) => NewValue} handlers.onFailure - Function to process the error value.
     * @return {NewValue} The result of the executed handler function.
     */
    fold<NewValue>(handlers: { onSuccess: (value: Value) => NewValue; onFailure: (error: ErrorValue) => NewValue }): NewValue;

    fold<NewValue>(
        handlers:
            | {
                  onSuccess: (value: Value) => NewValue;
                  onFailure: (error: ErrorValue) => NewValue;
              }
            | ((value: Value) => NewValue),
        onFailure?: (error: ErrorValue) => NewValue,
    ): NewValue {
        if (typeof handlers === 'object') {
            const { onSuccess, onFailure } = handlers;
            return this.fold(onSuccess, onFailure);
        }

        if (this.isSuccess) return (handlers as (value: Value) => NewValue)((this as unknown as Success<Value, ErrorValue>).value);
        return (onFailure as (error: ErrorValue) => NewValue)((this as unknown as Failure<Value, ErrorValue>).error);
    }

    /**
     * Returns the encapsulated result of the given transform function applied to the encapsulated error if this instance represents failure or the original
     * encapsulated value if it is success.
     * @template Value
     * @template NewValue
     * @template ErrorValue
     * @param {(ErrorValue) => NewValue} transform - A function that takes an Error as input and returns a new value.
     * @return {Result<NewValue, ErrorValue>} The encapsulated result of the given transform function applied to the encapsulated error if this instance represents
     * failure or the original encapsulated value if it is success.
     */
    recover<NewValue, Value extends NewValue>(this: Result<Value, ErrorValue>, transform: (error: ErrorValue) => NewValue): Result<NewValue, ErrorValue> {
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
     * @template ErrorValue
     * @param {(Value) => void} action - The callback function to be executed if the result is successful.
     * @return {Result<Value, ErrorValue>} The original Result unchanged.
     */
    onSuccess(action: (value: Value) => void): Result<Value, ErrorValue> {
        if (this.isSuccess) action(this.rawValue as Value);
        return this;
    }

    /**
     * Performs the given action on the encapsulated Throwable exception if this instance represents failure. Returns the original Result unchanged.
     *
     * @template Value
     * @template ErrorValue
     * @param {(ErrorValue) => void} action - The callback function to be executed if the result is failure.
     * @return {Result<Value, ErrorValue>} The original Result unchanged.
     */
    onFailure(action: (error: ErrorValue) => void): Result<Value, ErrorValue> {
        if (this.isFailure) action(this.rawValue as ErrorValue);
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
class Success<Value, ErrorValue> extends Result<Value, ErrorValue> {
    constructor(public readonly value: Value) {
        super();
    }
}

/**
 * A class that represents a failure result.
 *
 * @template Value The type of the value that would have been returned in case of success.
 */
class Failure<Value, ErrorValue> extends Result<Value, ErrorValue> {
    constructor(public readonly error: ErrorValue) {
        super();
    }
}

/**
 * A type guard function that checks if the given result is an instance of the Success class.
 *
 * @template Value
 * @template ErrorValue
 * @param {Result<Value, ErrorValue>} result - The result object to be checked.
 * @returns {result is Success<Value, ErrorValue>} Returns true if the result is an instance of Success, otherwise false.
 */
export const isSuccessResult = <Value, ErrorValue>(result: Result<Value, ErrorValue>): result is Success<Value, ErrorValue> => result instanceof Success;

/**
 * A type guard function that checks whether a `Result` object is a failure instance.
 *
 * @template Value
 * @template ErrorValue
 * @param {Result<Value, ErrorValue>} result - The `Result` object to be checked.
 * @returns {boolean} - Returns `true` if the given `result` is an instance of `Failure`, otherwise `false`.
 */
export const isFailureResult = <Value, ErrorValue>(result: Result<Value, ErrorValue>): result is Failure<Value, ErrorValue> => result instanceof Failure;
