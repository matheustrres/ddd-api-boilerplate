import { createId as createCuid } from '@paralleldrive/cuid2';

import { type DomainPrimitive, ValueObject } from './value-object';

import { DomainException } from '../exceptions/domain.exception';

export type StringIdGenerator = () => string;

export class StringIdVO extends ValueObject<string> {
	static #generator: StringIdGenerator = createCuid;

	/**
	 * @example StringIdVO.setGenerator(randomUUID);
	 * @param {StringIdGenerator} generator - A function that generates a string ID.
	 * @returns {void}
	 */
	static setGenerator(generator: StringIdGenerator): void {
		this.#generator = generator;
	}

	static createId(): StringIdVO {
		return new StringIdVO({ value: this.#generator() });
	}

	static createFrom(value: string): StringIdVO {
		return new StringIdVO({ value });
	}

	toString(): string {
		return this.props.value;
	}

	protected validate({ value }: DomainPrimitive<string>): void {
		if (value.trim().length <= 0) {
			throw new DomainException('String Id must not be empty');
		}
	}
}
