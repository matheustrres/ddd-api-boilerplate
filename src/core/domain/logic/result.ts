import { InvalidOperationError } from '@/core/domain/errors/invalid-operation';

type ResultOptions<T> =
	| {
			isSuccess: true;
			error?: never;
			value?: T;
	  }
	| {
			isSuccess: false;
			error: T | string;
			value?: never;
	  };

export class Result<T> {
	isSuccess: boolean;
	isFailure: boolean;

	#error?: T | string | never;
	#value?: T | never;

	private constructor(options: ResultOptions<T>) {
		if (options.isSuccess && options.error) {
			throw new InvalidOperationError(
				'A result can not be successful and contain an error',
			);
		}

		if (!options.isSuccess && !options.error) {
			throw new InvalidOperationError(
				`A failing result must have an error content`,
			);
		}

		this.isSuccess = options.isSuccess;
		this.isFailure = !options.isSuccess;
		this.#error = options.error;
		this.#value = options.value;
	}

	getError(): string | T | undefined {
		if (this.isSuccess) {
			throw new Error(
				'It is not possible to get the error of a successful result.',
			);
		}

		return this.#error;
	}

	getValue(): T | undefined {
		if (this.isFailure) {
			throw new Error(
				'It is not possible to get the value of a failure result.',
			);
		}

		return this.#value;
	}

	static ok<U>(value?: U): Result<U> {
		return new Result<U>({
			isSuccess: true,
			value,
		});
	}

	static fail<U>(error: U | string): Result<U> {
		return new Result<U>({
			isSuccess: false,
			error,
		});
	}

	static combineResults<U>(results: Result<U>[]): Result<U> {
		for (const result of results) {
			if (result.isFailure) return result;
		}

		return Result.ok();
	}
}
