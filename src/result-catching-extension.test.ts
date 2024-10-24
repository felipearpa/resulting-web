import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Result } from './result';
import './result-catching.extension';

describe('Result catching extension', () => {
    const successValue = 'value';

    const errorValue = 'error';
    const error = Error(errorValue);

    const successTransform = jest.fn<(value: string) => string>().mockImplementation((value: string) => `transformed (${value})`);
    const failureTransform = jest.fn<(error: Error) => string>().mockImplementation((error: Error) => `transformed (${error})`);

    const givenASuccessResult = () => Result.success(successValue);
    const givenAFailureResult = (): Result<string> => Result.failure(error);

    const thenTheSameInstanceIsRetrieved = (retrievedResult: Result<string>, result: Result<string>) => {
        expect(retrievedResult).toBe(result);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('mapCatching', () => {
        const safeSuccessTransform = jest.fn<(value: string) => string>().mockImplementation(() => `transformed ${successValue}`);

        const unsafeSuccessTransform = jest.fn<(value: string) => string>().mockImplementation(() => {
            throw error;
        });

        const whenApplyingATransformation = (result: Result<string>, transform: (value: string) => string) => {
            return result.mapCatching(transform);
        };

        const thenTheResultIsTransformed = (retrievedResult: Result<string>) => {
            const retrievedValue = retrievedResult.getOrNull();
            expect(retrievedValue).not.toBeNull();
            expect(retrievedValue).toBe(safeSuccessTransform(successValue));
            expect(safeSuccessTransform).toBeCalled();
        };

        const thenTheResultIsTransformedCatchingAnyError = (retrievedResult: Result<string>) => {
            const retrievedError = retrievedResult.errorOrNull();
            expect(retrievedError).not.toBeNull();
            expect(retrievedError).toBe(error);
            expect(unsafeSuccessTransform).toBeCalled();
        };

        const thenTheResultIsNotTransformed = (retrievedResult: Result<string>) => {
            const retrievedError = retrievedResult.errorOrNull();
            expect(retrievedError).not.toBeNull();
            expect(retrievedError).toBe(error);
            expect(safeSuccessTransform).not.toBeCalled();
        };

        test('given a success result when applying a transformation then the result is transformed', () => {
            const successResult = givenASuccessResult();
            const retrievedResult = whenApplyingATransformation(successResult, safeSuccessTransform);
            thenTheResultIsTransformed(retrievedResult);
        });

        test('given a success result when applying a transformation that raise an error then the result is transformed catching the error', () => {
            const successResult = givenASuccessResult();
            const retrievedResult = whenApplyingATransformation(successResult, unsafeSuccessTransform);
            thenTheResultIsTransformedCatchingAnyError(retrievedResult);
        });

        test('given a failure result when applying a transformation then the result is not transformed', () => {
            const failureResult = givenAFailureResult();
            const retrievedResult = whenApplyingATransformation(failureResult, successTransform);
            thenTheResultIsNotTransformed(retrievedResult);
        });
    });

    describe('recoverCatching', () => {
        const safeFailureTransform = jest.fn<(error: Error) => string>().mockImplementation((error) => `transformed ${error}`);

        const unsafeFailureTransform = jest.fn<(error: Error) => string>().mockImplementation((error) => {
            throw error;
        });

        const whenRecoveringFromAnError = (result: Result<string>, transform: (error: Error) => string) => {
            return result.recoverCatching(transform);
        };

        const thenTheFailureIsTransformed = (retrievedResult: Result<string>) => {
            expect(safeFailureTransform).toBeCalled();
            expect(retrievedResult.isSuccess).toBeTruthy();
            expect(retrievedResult.getOrNull()).toBe(safeFailureTransform(error));
        };

        const thenTheFailureIsTransformedCatchingAnyError = (retrievedResult: Result<string>) => {
            expect(unsafeFailureTransform).toBeCalled();
            expect(retrievedResult.isFailure).toBeTruthy();
            expect(retrievedResult.errorOrNull()).toBe(error);
        };

        test('given a success result when recovering from an error then the same instance is retrieved', () => {
            const successResult = givenASuccessResult();
            const retrievedResult = whenRecoveringFromAnError(successResult, failureTransform);
            thenTheSameInstanceIsRetrieved(successResult, retrievedResult);
        });

        test('given a failure result when recovering from an error then the failure is transformed', () => {
            const failureResult = givenAFailureResult();
            const retrievedResult = whenRecoveringFromAnError(failureResult, safeFailureTransform);
            thenTheFailureIsTransformed(retrievedResult);
        });

        test('given a failure result when recovering from an thrown error then the failure is transformed catching the error', () => {
            const failureResult = givenAFailureResult();
            const retrievedResult = whenRecoveringFromAnError(failureResult, unsafeFailureTransform);
            thenTheFailureIsTransformedCatchingAnyError(retrievedResult);
        });
    });
});
