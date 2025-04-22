import { isDeepStrictEqual } from 'node:util';

import { DomainException } from '../exceptions/domain.exception';
import { Guard } from '../logic/guard';

export type Primitives = string | number | boolean | bigint | symbol | Date;
export interface DomainPrimitive<T extends Primitives | Date> {
	value: T;
}
type Props<T> = T extends Primitives ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
	protected readonly props: Readonly<Props<T>>;

	protected constructor(props: Props<T>) {
		this.#assertIsNotEmpty(props);
		this.validate(props);
		this.props = Object.freeze(props);
	}

	equals(vo?: ValueObject<T>): boolean {
		if (!vo) return false;
		if (vo.constructor !== this.constructor) return false;
		return isDeepStrictEqual(this.props, vo.props);
	}

	toPrimitive(): Readonly<Props<T>> {
		return this.props;
	}

	protected abstract validate(props: Props<T>): void;

	#assertIsNotEmpty(props: Props<T>): void {
		if (Guard.isEmpty(props)) {
			throw new DomainException(
				`${this.constructor.name} properties must not be empty.`,
			);
		}
	}
}
