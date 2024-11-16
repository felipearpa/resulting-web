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
        mapCatching<NewValue extends NonNullable<unknown>>(transform: (value: Value) => NewValue): Result<NewValue>;

        /**
         * Returns the encapsulated result of the given transform function applied to the encapsulated error if this instance represents failure or the original
         * encapsulated value if it is a success.
         *
         * @template NewValue
         * @param {(Error) => NewValue} transform - The transformation function to apply to the error.
         * @return {Result<NewValue>} The encapsulated result of the given transform function applied to the encapsulated error if this instance represents
         * failure or the original encapsulated value if it is success.
         */
        recoverCatching<NewValue extends NonNullable<unknown>>(transform: (error: Error) => NewValue): Result<NewValue>;
    }
}

Result.prototype.mapCatching = function (transform) {
    if (this.isSuccess) {
        return runCatching(() => transform(this.value));
    }
    return Result.failure(this.value as Error);
};

Result.prototype.recoverCatching = function <NewValue extends NonNullable<unknown>, Value extends NewValue>(
    this: Result<Value>,
    transform: (error: Error) => NewValue,
) {
    const error = this.errorOrNull();
    if (error == null) return this;
    return runCatching(() => transform(error));
};
