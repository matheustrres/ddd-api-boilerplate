import { strictEqual, throws } from 'node:assert';
import { describe, it } from 'node:test';

import { Guard, type GuardArgumentCollection } from '@/core/domain/logic/guard';

describe('Guard', () => {
	describe('.againstAtLeast', () => {
		it('should fail if text does not have at least specified number of characters', () => {
			const result = Guard.againstAtLeast(20, 'Lorem Ipsum');

			strictEqual(result.isFailure, true);
			strictEqual(result.isSuccess, false);
			strictEqual(result.getError(), 'Text is not at least 20 characters.');
		});

		it('should succeed if text has at least specified number of characters', () => {
			const result = Guard.againstAtLeast(12, 'Hello World!');

			strictEqual(result.isSuccess, true);
			strictEqual(result.isFailure, false);
			throws(() => result.getError(), {
				message: 'It is not possible to get the error of a successful result.',
			});
		});
	});

	describe('.againstAtMost', () => {
		it('should fail if text has more than specified number of characters', () => {
			const result = Guard.againstAtMost(3, 'Lorem Ipsum');

			strictEqual(result.isFailure, true);
			strictEqual(result.isSuccess, false);
			strictEqual(result.getError(), 'Text is greater than 3 characters.');
		});

		it('should succeed if text has at most specified number of characters', () => {
			const result = Guard.againstAtMost(11, 'Lorem Ipsum');

			strictEqual(result.isSuccess, true);
			strictEqual(result.isFailure, false);
			throws(() => result.getError(), {
				message: 'It is not possible to get the error of a successful result.',
			});
		});
	});

	describe('.againstNullOrUndefined', () => {
		it('should fail if argument is null or undefined', () => {
			const result = Guard.againstNullOrUndefined(null, 'username');

			strictEqual(result.isFailure, true);
			strictEqual(result.isSuccess, false);
			strictEqual(
				result.getError(),
				'Argument {username} is null or undefined',
			);
		});

		it('should succeed if argument is not null or undefined', () => {
			const result = Guard.againstNullOrUndefined('Jonh Doe', 'username');

			strictEqual(result.isSuccess, true);
			strictEqual(result.isFailure, false);
			throws(() => result.getError(), {
				message: 'It is not possible to get the error of a successful result.',
			});
		});
	});

	describe('.againstNullOrUndefinedBulk', () => {
		it('should fail if some argument is null or undefined', () => {
			const collection: GuardArgumentCollection = [
				{ argument: 'value1', argumentName: 'arg1' },
				{ argument: null, argumentName: 'arg2' },
				{ argument: 'value3', argumentName: 'arg3' },
			];

			const result = Guard.againstNullOrUndefinedBulk(collection);

			strictEqual(result.isFailure, true);
			strictEqual(result.isSuccess, false);
			strictEqual(result.getError(), 'Argument {arg2} is null or undefined');
		});

		it('should succeed if all arguments are not null or undefined', () => {
			const collection: GuardArgumentCollection = [
				{ argument: 'value1', argumentName: 'arg1' },
				{ argument: 'value2', argumentName: 'arg2' },
				{ argument: 'value3', argumentName: 'arg3' },
			];

			const result = Guard.againstNullOrUndefinedBulk(collection);

			strictEqual(result.isSuccess, true);
			strictEqual(result.isFailure, false);
			throws(() => result.getError(), {
				message: 'It is not possible to get the error of a successful result.',
			});
		});
	});

	describe('.greaterThan', () => {
		it('should fail if actual value is not greater than min value', () => {
			const result = Guard.greaterThan(20, 10);

			strictEqual(result.isFailure, true);
			strictEqual(result.isSuccess, false);
			strictEqual(
				result.getError(),
				'Number value {10} is not greater than {20}',
			);
		});

		it('should succeed if actual value is greater than min value', () => {
			const result = Guard.greaterThan(10, 14);

			strictEqual(result.isSuccess, true);
			strictEqual(result.isFailure, false);
			throws(() => result.getError(), {
				message: 'It is not possible to get the error of a successful result.',
			});
		});
	});

	describe('.inRange', () => {
		it('should fail if the number is less than the minimum value or greater than the maximum value set', () => {
			const result = Guard.inRange(10, 15, 20, 'id');

			strictEqual(result.isFailure, true);
			strictEqual(result.isSuccess, false);
			strictEqual(result.getError(), 'id is not within range 15 to 20.');
		});

		it('should succeed if the number is greater than or equal to the minimum value or less than or equal to the maximum value set', () => {
			const result = Guard.inRange(5, 0, 10, 'id');

			strictEqual(result.isSuccess, true);
			strictEqual(result.isFailure, false);
			throws(() => result.getError(), {
				message: 'It is not possible to get the error of a successful result.',
			});
		});
	});
});
