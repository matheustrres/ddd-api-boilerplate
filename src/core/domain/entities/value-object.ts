export abstract class ValueObject<T> {
	readonly props: T;

	constructor(props: T) {
		this.validate(props);

		this.props = props;
	}

	static create<T, U extends ValueObject<T>>(
		this: new (props: T) => U,
		props: T,
	): U {
		return new this(props);
	}

	protected abstract validate(props: T): void;
}
