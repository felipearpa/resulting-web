import { isFailureResult, isSuccessResult, Result } from './result';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('Result', () => {
    const successValue = 'value';

    const errorValue = 'error';
    const defaultValue = 'defaultValue';

    const error = Error(errorValue);

    const successTransform = jest.fn<(value: string) => string>().mockImplementation((value: string) => `transformed (${value})`);

    const failureTransform = jest.fn<(error: Error) => string>().mockImplementation((error) => `transformed (${error})`);

    const givenASuccessResult = () => Result.success<string, Error>(successValue);

    const givenAFailureResult = (): Result<string, Error> => Result.failure(error);

    const thenValueIsRetrieved = (retrievedValue: string | null) => {
        expect(retrievedValue).toBe(successValue);
    };

    const thenNullIsRetrieved = (retrievedValue: string | Error | null) => {
        expect(retrievedValue).toBeNull();
    };

    const thenTheErrorIsRetrieved = (retrievedValue: Error | null) => {
        expect(retrievedValue).toBe(error);
    };

    const thenTheSameInstanceIsRetrieved = (retrievedResult: Result<string, Error>, result: Result<string, Error>) => {
        expect(retrievedResult).toBe(result);
    };

    const thenAnotherInstanceIsRetrieved = (retrievedResult: Result<string, Error>, result: Result<string, Error>) => {
        expect(retrievedResult).not.toBe(result);
    };

    const thenTheTransformationIsApplied = (transformation: jest.Mock<(value: string) => string> | jest.Mock<(error: Error) => string>) => {
        expect(transformation).toBeCalled();
    };

    const thenTheTransformationIsNotApplied = (transformation: jest.Mock<(value: string) => string> | jest.Mock<(error: Error) => string>) => {
        expect(transformation).not.toBeCalled();
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('isSuccess', () => {
        test('given a success result when checking success then true is retrieved', () => {
            const successResult = givenASuccessResult();
            expect(successResult.isSuccess).toBeTruthy();
        });

        test('given a failure result when checking success then false is retrieved', () => {
            const failureResult = givenAFailureResult();
            expect(failureResult.isSuccess).toBeFalsy();
        });
    });

    describe('isFailure', () => {
        test('given a failure result when checking failure then true is retrieved', () => {
            const failureResult = givenAFailureResult();
            expect(failureResult.isFailure).toBeTruthy();
        });

        test('given a success result when checking failure then false is retrieved', () => {
            const successResult = givenASuccessResult();
            expect(successResult.isFailure).toBeFalsy();
        });
    });

    describe('getOrNull', () => {
        const whenRetrievingTheValue = (result: Result<string, Error>) => {
            return result.getOrNull();
        };

        test('given a success result when retrieving the value then the value is retrieved', () => {
            const successResult = givenASuccessResult();
            const retrievedValue = whenRetrievingTheValue(successResult);
            thenValueIsRetrieved(retrievedValue);
        });

        test('given a failure result when retrieving the value then the null is retrieved', () => {
            const failureError = givenAFailureResult();
            const retrievedValue = whenRetrievingTheValue(failureError);
            thenNullIsRetrieved(retrievedValue);
        });
    });

    describe('getOrElse', () => {
        const whenRetrievingTheValueWithFallback = (result: Result<string, Error>, onFailure: (error: Error) => string) => {
            return result.getOrElse(onFailure);
        };

        const thenTheFailureTransformationIsApplied = (retrievedValue: string) => {
            thenTheTransformationIsApplied(failureTransform);
            expect(retrievedValue).toBe(failureTransform(error));
        };

        test('given a success result when retrieving the value with fallback then the value is retrieved', () => {
            const successResult = givenASuccessResult();
            const retrievedValue = whenRetrievingTheValueWithFallback(successResult, failureTransform);
            thenTheTransformationIsNotApplied(failureTransform);
            thenValueIsRetrieved(retrievedValue);
        });

        test('given a failure result when retrieving the value with fallback then the failure transformation is applied', () => {
            const failureResult = givenAFailureResult();
            const retrievedValue = whenRetrievingTheValueWithFallback(failureResult, failureTransform);
            thenTheFailureTransformationIsApplied(retrievedValue);
        });
    });

    describe('getOrDefault', () => {
        const whenRetrievingTheValueWithDefault = (result: Result<string, Error>, defaultValue: string) => {
            return result.getOrDefault(defaultValue);
        };

        const thenTheDefaultValueIsRetrieved = (retrievedValue: string | null) => {
            expect(retrievedValue).toBe(defaultValue);
        };

        test('given a success result when retrieving the value with default then the value is retrieved', () => {
            const successResult = givenASuccessResult();
            const retrievedValue = whenRetrievingTheValueWithDefault(successResult, defaultValue);
            thenValueIsRetrieved(retrievedValue);
        });

        test('given a failure result when retrieving the value with default then the default value is retrieved', () => {
            const failureResult = givenAFailureResult();
            const retrievedValue = whenRetrievingTheValueWithDefault(failureResult, defaultValue);
            thenTheDefaultValueIsRetrieved(retrievedValue);
        });
    });

    describe('getOrThrow', () => {
        const whenRetrievingTheValueSafely = (result: Result<string, Error>) => {
            return result.getOrThrow();
        };

        const thenErrorIsRaised = (unsafePerform: () => void) => {
            expect(unsafePerform).toThrow(Error);
        };

        test('given a success result when retrieving the value safely then the value is retrieved', () => {
            const successResult = givenASuccessResult();
            const retrievedValue = whenRetrievingTheValueSafely(successResult);
            thenValueIsRetrieved(retrievedValue);
        });

        test('given a failure result when retrieving the value safely then the error is raised', () => {
            const failureResult = givenAFailureResult();

            const unsafeWhenGetOrThrowIsExecuted = () => {
                whenRetrievingTheValueSafely(failureResult);
            };

            thenErrorIsRaised(unsafeWhenGetOrThrowIsExecuted);
        });
    });

    describe('errorOrNull', () => {
        const whenRetrievingTheError = (result: Result<string, Error>) => {
            return result.errorOrNull();
        };

        test('given a success result when retrieving the error then null is retrieved', () => {
            const successResult = givenASuccessResult();
            const retrievedValue = whenRetrievingTheError(successResult);
            thenNullIsRetrieved(retrievedValue);
        });

        test('given a failure result when retrieving the error then the error is retrieved', () => {
            const failureResult = givenAFailureResult();
            const retrievedValue = whenRetrievingTheError(failureResult);
            thenTheErrorIsRetrieved(retrievedValue);
        });
    });

    describe('map', () => {
        const whenApplyingATransformation = (result: Result<string, Error>, transform: (value: string) => string) => {
            return result.map(transform);
        };

        const thenTheResultIsTransformed = (retrievedResult: Result<string, Error>) => {
            thenTheTransformationIsApplied(successTransform);
            expect(retrievedResult.isSuccess).toBeTruthy();
            expect(retrievedResult.getOrNull()).toBe(successTransform(successValue));
        };

        const thenTheResultIsNotTransformed = (retrievedResult: Result<string, Error>) => {
            thenTheTransformationIsNotApplied(successTransform);
            expect(retrievedResult.isFailure).toBeTruthy();
            expect(retrievedResult.errorOrNull()).toBe(error);
        };

        test('given a success result when applying a transformation then the result is transformed', () => {
            const successResult = givenASuccessResult();
            const retrievedResult = whenApplyingATransformation(successResult, successTransform);
            thenTheResultIsTransformed(retrievedResult);
        });

        test('given a failure result when applying a transformation then the result is not transformed', () => {
            const failureResult = givenAFailureResult();
            const retrievedResult = whenApplyingATransformation(failureResult, successTransform);
            thenAnotherInstanceIsRetrieved(retrievedResult, failureResult);
            thenTheResultIsNotTransformed(retrievedResult);
        });
    });

    describe('fold', () => {
        const thenTheSuccessTransformationIsApplied = (retrievedValue: string) => {
            expect(successTransform).toBeCalled();
            expect(failureTransform).not.toBeCalled();
            expect(retrievedValue).toBe(successTransform(successValue));
        };

        const thenTheFailureTransformationIsNotApplied = (retrievedValue: string) => {
            expect(successTransform).not.toBeCalled();
            expect(failureTransform).toBeCalled();
            expect(retrievedValue).toBe(failureTransform(error));
        };

        describe('fold by using individual handlers', () => {
            const whenFolding = (result: Result<string, Error>, onSuccess: (value: string) => string, onFailure: (error: Error) => string) => {
                return result.fold(onSuccess, onFailure);
            };

            test('given a success result when folding then the success transformation is applied', () => {
                const successResult = givenASuccessResult();
                const retrievedValue = whenFolding(successResult, successTransform, failureTransform);
                thenTheSuccessTransformationIsApplied(retrievedValue);
            });

            test('given a failure result when folding then the transformation for failure is applied', () => {
                const successResult = givenAFailureResult();
                const retrievedValue = whenFolding(successResult, successTransform, failureTransform);
                thenTheFailureTransformationIsNotApplied(retrievedValue);
            });
        });

        describe('fold by using an object', () => {
            const whenFolding = (
                result: Result<string, Error>,
                transformation: {
                    onSuccess: (value: string) => string;
                    onFailure: (error: Error) => string;
                },
            ) => {
                return result.fold(transformation);
            };

            test('given a success result when folding then the success transformation is applied', () => {
                const successResult = givenASuccessResult();
                const retrievedValue = whenFolding(successResult, {
                    onSuccess: successTransform,
                    onFailure: failureTransform,
                });
                thenTheSuccessTransformationIsApplied(retrievedValue);
            });

            test('given a failure result when folding then the transformation for failure is applied', () => {
                const successResult = givenAFailureResult();
                const retrievedValue = whenFolding(successResult, {
                    onSuccess: successTransform,
                    onFailure: failureTransform,
                });
                thenTheFailureTransformationIsNotApplied(retrievedValue);
            });
        });
    });

    describe('recover', () => {
        const whenRecovering = (result: Result<string, Error>, onFailure: (error: Error) => string) => {
            return result.recover(onFailure);
        };

        const thenTheFailureTransformationIsApplied = (retrievedResult: Result<string, Error>) => {
            expect(retrievedResult.isSuccess).toBeTruthy();
            expect(failureTransform).toBeCalled();
        };

        test('given a success result when recovering then the same instance is retrieved', () => {
            const successResult = givenASuccessResult();
            const retrievedResult = whenRecovering(successResult, failureTransform);
            thenTheSameInstanceIsRetrieved(retrievedResult, successResult);
        });

        test('given a failure result when recovering then the failure transformation is applied', () => {
            const failureResult = givenAFailureResult();
            const retrievedResult = whenRecovering(failureResult, failureTransform);
            thenTheFailureTransformationIsApplied(retrievedResult);
        });
    });

    describe('onSuccess', () => {
        const whenHandlingSuccess = (result: Result<string, Error>, onSuccess: (value: string) => void) => {
            return result.onSuccess(onSuccess);
        };

        const thenTheSuccessActionIsExecuted = (successAction: jest.Mock<(value: string) => void>) => {
            expect(successAction).toBeCalled();
        };

        const thenTheSuccessActionIsNotExecuted = (successAction: jest.Mock<(value: string) => void>) => {
            expect(successAction).not.toBeCalled();
        };

        test('given a success result when handling success then the success action is executed', () => {
            const successResult = givenASuccessResult();
            const successAction = jest.fn<(value: string) => void>();

            const retrievedResult = whenHandlingSuccess(successResult, successAction);

            thenTheSameInstanceIsRetrieved(retrievedResult, successResult);
            thenTheSuccessActionIsExecuted(successAction);
        });

        test('given a failure result when handling success then the success action is not executed', () => {
            const failureResult = givenAFailureResult();
            const successAction = jest.fn<(value: string) => void>();

            const retrievedResult = whenHandlingSuccess(failureResult, successAction);

            thenTheSameInstanceIsRetrieved(retrievedResult, failureResult);
            thenTheSuccessActionIsNotExecuted(successAction);
        });
    });

    describe('onFailure', () => {
        const whenHandlingFailure = (result: Result<string, Error>, onFailure: (error: Error) => void) => {
            return result.onFailure(onFailure);
        };

        const thenTheActionFailureIsExecuted = (failureAction: jest.Mock<(error: Error) => void>) => {
            expect(failureAction).toBeCalled();
        };

        const thenTheActionFailureIsNotExecuted = (failureAction: jest.Mock<(error: Error) => void>) => {
            expect(failureAction).not.toBeCalled();
        };

        test('given a failure result when handling failure then the failure action is executed', () => {
            const failureResult = givenAFailureResult();
            const failureAction = jest.fn<(error: Error) => void>();

            const retrievedResult = whenHandlingFailure(failureResult, failureAction);

            thenTheSameInstanceIsRetrieved(retrievedResult, failureResult);
            thenTheActionFailureIsExecuted(failureAction);
        });

        test('given a success result when handling failure then the failure action is not executed', () => {
            const successResult = givenASuccessResult();
            const failureAction = jest.fn<(error: Error) => void>();

            const retrievedResult = whenHandlingFailure(successResult, failureAction);

            thenTheSameInstanceIsRetrieved(retrievedResult, successResult);
            thenTheActionFailureIsNotExecuted(failureAction);
        });
    });

    describe('toString', () => {
        const whenConvertingToString = (result: Result<string, Error>) => {
            return result.toString();
        };

        const thenTheValueRepresentationStringIsRetrieved = (representationString: string) => {
            expect(representationString).toBe(successValue.toString());
        };

        const thenTheErrorRepresentationStringIsRetrieved = (representationString: string) => {
            expect(representationString).toBe(error.toString());
        };

        test('given a success result when converting to string then the value representation string is retrieved', () => {
            const successResult = givenASuccessResult();
            const retrievedRepresentationString = whenConvertingToString(successResult);
            thenTheValueRepresentationStringIsRetrieved(retrievedRepresentationString);
        });

        test('given a failure result when converting to string then the error representation string is retrieved', () => {
            const failureResult = givenAFailureResult();
            const retrievedRepresentationString = whenConvertingToString(failureResult);
            thenTheErrorRepresentationStringIsRetrieved(retrievedRepresentationString);
        });
    });

    describe('Result with void success and Error failure', () => {
        const voidSuccessResult = Result.success();
        const voidFailureResult = Result.failure<void, Error>(error);

        test('given a void success result when retrieving the value safely then the value is retrieved', () => {
            const unsafeWhenGetOrThrowIsExecuted = () => {
                voidSuccessResult.getOrThrow();
            };

            expect(unsafeWhenGetOrThrowIsExecuted).not.toThrow(Error);
        });

        test('given a void error result when retrieving the value safely then the error is raised', () => {
            const unsafeWhenGetOrThrowIsExecuted = () => {
                voidFailureResult.getOrThrow();
            };

            expect(unsafeWhenGetOrThrowIsExecuted).toThrow(Error);
        });
    });

    describe('Result.success type safety', () => {
        test('given an implicit void success result when instantiated without annotation then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.success();

            const typed: Result<void, Error> = result;
            expect(typed).toBeDefined();
        });

        test('given an explicit void success result when instantiated without annotation then is allowed', () => {
            const result: Result<void, Error> = Result.success();

            // noinspection UnnecessaryLocalVariableJS
            const typed: Result<void, Error> = result;

            expect(typed).toBeDefined();
        });

        test('given an implicit void success result when instantiated with annotation then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.success<void, Error>();

            const typed: Result<void, Error> = result;
            expect(typed).toBeDefined();
        });

        test('given an explicit void success result when instantiated with annotation then is allowed', () => {
            const result: Result<void, Error> = Result.success<void, Error>();

            // noinspection UnnecessaryLocalVariableJS
            const typed: Result<void, Error> = result;

            expect(typed).toBeDefined();
        });

        test('given an implicit void success result when is instanced with annotation and undefined as parameter then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.success<void, Error>(undefined);

            const typed: Result<void, Error> = result;
            expect(typed).toBeDefined();
        });

        test('given an explicit void success result when is instanced with annotation and undefined as parameter then is allowed', () => {
            const result: Result<void, Error> = Result.success<void, Error>(undefined);

            // noinspection UnnecessaryLocalVariableJS
            const typed: Result<void, Error> = result;

            expect(typed).toBeDefined();
        });

        test('given an undefined success result when is instanced then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.success<undefined, Error>();

            const typed: Result<undefined, Error> = result;
            expect(typed).toBeDefined();
        });

        test('given a string success result when is instanced then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.success('hello');

            const typed: Result<string, Error> = result;
            expect(typed).toBeDefined();
        });

        test('given a number success result when is instanced then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.success(42);

            const typed: Result<number, Error> = result;
            expect(typed).toBeDefined();
        });
    });

    describe('Result.failure type safety', () => {
        test('given an implicit void failure result when instantiated without annotation then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.failure();

            const typed: Result<void, void> = result;
            expect(typed).toBeDefined();
        });

        test('given an explicit void failure result when instantiated without annotation then is allowed', () => {
            const result: Result<void, void> = Result.failure();

            // noinspection UnnecessaryLocalVariableJS
            const typed: Result<void, void> = result;

            expect(typed).toBeDefined();
        });

        test('given an implicit void failure result when instantiated with annotation then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.failure<void, void>();

            const typed: Result<void, void> = result;
            expect(typed).toBeDefined();
        });

        test('given an explicit void failure result when instantiated with annotation then is allowed', () => {
            const result: Result<void, void> = Result.failure<void, void>();

            // noinspection UnnecessaryLocalVariableJS
            const typed: Result<void, void> = result;

            expect(typed).toBeDefined();
        });

        test('given an implicit void failure result when is instanced with annotation and undefined as parameter then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.failure<void, void>(undefined);

            const typed: Result<void, void> = result;
            expect(typed).toBeDefined();
        });

        test('given an explicit void failure result when is instanced with annotation and undefined as parameter then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result: Result<void, void> = Result.failure<void, void>(undefined);

            // noinspection UnnecessaryLocalVariableJS
            const typed: Result<void, void> = result;

            expect(typed).toBeDefined();
        });

        test('given an undefined failure result when is instanced then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.failure<void, undefined>();

            const typed: Result<void, undefined> = result;
            expect(typed).toBeDefined();
        });

        test('given a string failure result when is instanced then is allowed', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.failure('hello');

            const typed: Result<void, string> = result;
            expect(typed).toBeDefined();
        });

        test('given a number failure result when is instanced then is allowed', () => {
            const result = Result.failure(42);
            expect(result).toBeInstanceOf(Result<number, Error>);
            expect(result.errorOrNull()).toBe(42);
        });
    });

    describe('Result.success without error type', () => {
        test('given success result without error type when instantiated without annotation then the error type is Error', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.success('value');

            const typed: Result<string, Error> = result;
            expect(typed).toBeDefined();
        });

        test('given success void result without error type when instantiated with annotation then the error type is Error', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.success();

            const typed: Result<void, Error> = result;
            expect(typed).not.toBeUndefined();
        });
    });

    describe('Result.failure without value type', () => {
        test('given failure result without value type when instantiated without annotation then the value type is void', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.failure('error');
            const typed: Result<void, string> = result;
            expect(typed).toBeDefined();
        });

        test('given failure void result without value type when instantiated without annotation then the value type is void', () => {
            // noinspection UnnecessaryLocalVariableJS
            const result = Result.failure();
            const typed: Result<void, void> = result;
            expect(typed).toBeDefined();
        });
    });

    describe('type guard for Result', () => {
        test('given a success result when checking type guard then SuccessResult is retrieved', () => {
            const result = Result.success('test-value');

            if (isSuccessResult(result)) {
                expect(result.value).toBe('test-value');
            } else {
                throw new Error('Expected result to be a success');
            }
        });

        test('given a failure result when checking type guard then FailureResult is retrieved', () => {
            const result = Result.failure(Error());

            if (isFailureResult(result)) {
                expect(result.error).toBeInstanceOf(Error);
            } else {
                throw new Error('Expected result to be a failure');
            }
        });
    });
});
