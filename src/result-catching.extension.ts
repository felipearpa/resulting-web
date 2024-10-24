import { Result } from './result';
import { runCatching } from './run-catching';

declare module './result' {
    interface Result<Value> {
        /**
         * Returns the encapsulated result of the given transform function applied to the encapsulated value if this instance represents success or the original
         * encapsulated error if it is failure.
         *
         * @template Value
         * @template NewValue
         * @param {(Value) => NewValue} transform - The function to transform the value.
         * @return {Result<NewValue>} The encapsulated result of the given transform function applied to the encapsulated value if this instance represents
         * success or the original encapsulated error if it is failure.
         */
        mapCatching<NewValue>(transform: (value: Value) => NewValue): Result<NewValue>;

        /**
         * Returns the encapsulated result of the given transform function applied to the encapsulated error if this instance represents failure or the original
         * encapsulated value if it is success.
         *
         * @template NewValue
         * @param {(Error) => NewValue} transform - The transformation function to apply to the error.
         * @return {Result<NewValue>} The encapsulated result of the given transform function applied to the encapsulated error if this instance represents
         * failure or the original encapsulated value if it is success.
         */
        recoverCatching<NewValue>(transform: (error: Error) => NewValue): Result<NewValue>;
    }
}

Result.prototype.mapCatching = function (transform) {
    if (this.isSuccess) {
        return runCatching(() => transform(this.value));
    }
    return Result.failure(this.value as Error);
};

Result.prototype.recoverCatching = function <NewValue, value extends NewValue>(this: Result<value>, transform: (error: Error) => NewValue) {
    const error = this.errorOrNull();
    if (error == null) return this;
    return runCatching(() => transform(error));
};
