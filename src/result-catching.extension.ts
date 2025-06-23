import { Result } from './result';
import { runCatching } from './run-catching';

declare module './result' {
    interface Result<Value, ErrorValue> {
        /**
         * Returns the encapsulated result of the given transform function applied to the encapsulated value if this instance represents success or the original
         * encapsulated error if it is failure.
         *
         * @template Value
         * @template NewValue
         * @param {(Value) => NewValue} transform - The function to transform the value.
         * @return {Result<NewValue, Error>} The encapsulated result of the given transform function applied to the encapsulated value if this instance represents
         * success or the original encapsulated error if it is failure.
         */
        mapCatching<NewValue>(transform: (value: Value) => NewValue): Result<NewValue, Error>;

        /**
         * Returns the encapsulated result of the given transform function applied to the encapsulated error if this instance represents failure or the original
         * encapsulated value if it is a success.
         *
         * @template NewValue
         * @param {(Error) => NewValue} transform - The transformation function to apply to the error.
         * @return {Result<NewValue, Error>} The encapsulated result of the given transform function applied to the encapsulated error if this instance represents
         * failure or the original encapsulated value if it is success.
         */
        recoverCatching<NewValue>(transform: (error: Error) => NewValue): Result<NewValue, Error>;
    }
}

Result.prototype.mapCatching = function (transform) {
    if (this.isSuccess) {
        return runCatching(() => transform(this.rawValue));
    }
    return Result.failure(this.rawValue as Error);
};

Result.prototype.recoverCatching = function <NewValue, Value extends NewValue>(this: Result<Value, Error>, transform: (error: Error) => NewValue) {
    if (this.isSuccess) return this;
    return runCatching(() => transform(this.rawValue as Error));
};
