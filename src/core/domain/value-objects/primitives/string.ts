import { DomainException } from '../../exceptions/domain.exception';
import { type DomainPrimitive, ValueObject } from '../value-object';

export abstract class StringVO extends ValueObject<string> {
	protected readonly value: string;

	constructor(value: string) {
		super({ value });
		this.value = value;
	}

	toString(): string {
		return this.value;
	}

	has(value: string): boolean {
		return this.value.includes(value);
	}

	extract(start: string, end: string): string {
		const indexStartValue = this.value.indexOf(start);
		const indexEndValue = this.value.lastIndexOf(end) + 1;
		return this.value.substring(indexStartValue, indexEndValue);
	}

	remove(substrings: string[]): string {
		const regex = new RegExp(`[${substrings.join('')}]`, 'g');
		return this.value.replace(regex, '');
	}

	protected validate(props: DomainPrimitive<string>): void {
		if (props.value.trim().length <= 0) {
			throw new DomainException(
				`${this.constructor.name} should not be empty.`,
			);
		}
	}
}
