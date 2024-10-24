import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { runCatching } from './run-catching';
import { Result } from './result';

describe('run-catching', () => {
    const error = Error('error');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const givenAnActionWhoNotThrowAnyException = () => {
        return jest.fn<() => string>().mockReturnValue('result');
    };

    const givenAnActionWhoThrowAnyException = () => {
        return jest.fn<() => string>().mockImplementation(() => {
            throw error;
        });
    };

    const whenRun = (action: () => string) => {
        return runCatching(action);
    };

    const thenASuccessResultIsRetrieved = (retrievedResult: Result<string>, action: jest.Mock<() => string>) => {
        expect(action).toBeCalled();

        expect(retrievedResult.isSuccess).toBeTruthy();

        const retrievedValue = retrievedResult.getOrNull();
        expect(retrievedValue).not.toBeNull();
        expect(retrievedValue).toBe(action());
    };

    const thenAFailureResultIsRetrieved = (retrievedResult: Result<string>, action: jest.Mock<() => string>) => {
        expect(action).toBeCalled();

        expect(retrievedResult.isFailure).toBeTruthy();

        const retrievedError = retrievedResult.errorOrNull();
        expect(retrievedError).not.toBeNull();
        expect(retrievedError).toBe(error);
    };

    test('given a action that does not throw any exception when run then a success result is retrieved', () => {
        const action = givenAnActionWhoNotThrowAnyException();
        const retrievedResult = whenRun(action);
        thenASuccessResultIsRetrieved(retrievedResult, action);
    });

    test('given a action that throw an exception when run then a failure result is retrieved', () => {
        const action = givenAnActionWhoThrowAnyException();
        const retrievedResult = whenRun(action);
        thenAFailureResultIsRetrieved(retrievedResult, action);
    });
});
