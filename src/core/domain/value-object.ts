export abstract class ValueObject<T> {
	readonly props: T;

	constructor(props: T) {
		this.validate(props);

		this.props = props;
	}

	protected abstract validate(props: T): void;

	static create<T, U extends ValueObject<T>>(
		this: new (props: T) => U,
		props: T,
	): U {
		return new this(props);
	}

	equals(vo?: ValueObject<T>): boolean {
		if (!vo || !vo.props) {
			return false;
		}

		return JSON.stringify(this.props) === JSON.stringify(vo.props);
	}
}
