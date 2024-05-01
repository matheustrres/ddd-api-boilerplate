import { Result } from '@/core/domain/logic/result';

type GuardResponse = string;

export type GuardArgument<Argument = unknown> = {
	argument: Argument;
	argumentName: string;
};

export type GuardArgumentCollection = GuardArgument[];

export class Guard {
	static againstAtLeast(numChars: number, text: string): Result<GuardResponse> {
		return text.length >= numChars
			? Result.ok<GuardResponse>()
			: Result.fail<GuardResponse>(
					`Text is not at least ${numChars} characters.`,
				);
	}

	static againstAtMost(numChars: number, text: string): Result<GuardResponse> {
		return text.length <= numChars
			? Result.ok<GuardResponse>()
			: Result.fail<GuardResponse>(
					`Text is greater than ${numChars} characters.`,
				);
	}

	static againstNullOrUndefined(
		argument: any,
		argumentName: string,
	): Result<GuardResponse> {
		if (argument === null || argument === undefined) {
			return Result.fail<GuardResponse>(
				`Argument {${argumentName}} is null or undefined`,
			);
		}

		return Result.ok<GuardResponse>();
	}

	static againstNullOrUndefinedBulk(
		argumentCollection: GuardArgumentCollection,
	): Result<GuardResponse> {
		for (const { argument, argumentName } of argumentCollection) {
			const result = this.againstNullOrUndefined(argument, argumentName);

			if (result.isFailure) return result;
		}

		return Result.ok<GuardResponse>();
	}

	static greaterThan(minValue: number, actualValue: number): Result<string> {
		return actualValue > minValue
			? Result.ok<GuardResponse>()
			: Result.fail<GuardResponse>(
					`Number value {${actualValue}} is not greater than {${minValue}}`,
				);
	}

	static inRange(
		num: number,
		min: number,
		max: number,
		argumentName: string,
	): Result<GuardResponse> {
		const isInRange = num >= min && num <= max;

		if (!isInRange) {
			return Result.fail<GuardResponse>(
				`${argumentName} is not within range ${min} to ${max}.`,
			);
		}

		return Result.ok<GuardResponse>();
	}

	static isObject(argumentName: string, value: unknown) {
		const isNullOrUndefined = this.againstNullOrUndefined(value, argumentName);

		if (isNullOrUndefined.isFailure) {
			return Result.fail<GuardResponse>(isNullOrUndefined.getError()!);
		}

		const isObject = typeof value === 'object';
		const isArray = Array.isArray(value);

		return isObject && !isArray
			? Result.ok<GuardResponse>()
			: Result.fail<GuardResponse>(`${argumentName} is not an object.`);
	}
}
