export interface UniqueId<T> {
	equalsTo(id: T): boolean;
	toString(): string;
}
