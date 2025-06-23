import { Result } from './result';

/**
 * Calls the specified function block and returns its encapsulated result if invocation was successful, catching any error that was thrown from the block
 * function execution and encapsulating it as a failure.
 *
 * @template Value
 * @param {() => Value} block - A function to execute which returns a value of type `Value`.
 * @returns {Result<Value>} The encapsulated result if invocation was successful, catching any error that was thrown from the block function execution and
 * encapsulating it as a failure.
 */
export const runCatching = <Value extends NonNullable<unknown>>(block: () => Value): Result<Value, Error> => {
    try {
        return Result.success(block());
    } catch (error) {
        if (typeof error === 'string') {
            return Result.failure(new Error(error));
        } else if (error instanceof Error) {
            return Result.failure(error);
        } else if (typeof error === 'object' && error) {
            return Result.failure(new Error(error.toString()));
        }
        return Result.failure(new Error(String(error)));
    }
};
