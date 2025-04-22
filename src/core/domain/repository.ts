import { type Entity } from './entity';
import { type ValueObject } from './value-objects/value-object';

export abstract class Repository<
	EntityId extends ValueObject<unknown>,
	T extends Entity<EntityId, unknown>,
> {
	abstract deleteOne(id: string): Promise<void>;
	abstract findAll(): Promise<T[]>;
	abstract findById(id: string): Promise<T | null>;
	abstract insertOne(entity: T): Promise<void>;
	abstract updateOne(entity: T): Promise<void>;
}
