export class DomainEvent<T = unknown> {
	readonly name: string;
	readonly data: T;
	readonly createdAt = new Date();

	constructor(name: string, data: T) {
		this.name = name;
		this.data = data;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}
}
