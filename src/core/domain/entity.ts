import { type ValueObject } from './value-objects/value-object';

type WithoutDates<T> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type CreateEntityProps<
	EntityId extends ValueObject<unknown>,
	EntityProps,
> = {
	id: EntityId;
	props: EntityProps;
	createdAt?: Date; // allows ‘restore’
	updatedAt?: Date | null;
	deletedAt?: Date | null;
};

export abstract class Entity<
	EntityId extends ValueObject<unknown>,
	EntityProps,
> {
	readonly id: EntityId;
	protected readonly props!: EntityProps;
	readonly createdAt: Date;

	protected constructor({
		id,
		props,
		createdAt,
	}: CreateEntityProps<EntityId, EntityProps>) {
		this.id = id;
		this.props = props;
		this.createdAt = createdAt ?? new Date();
	}

	static isSame<
		A extends Entity<ValueObject<unknown>, unknown>,
		B extends Entity<ValueObject<unknown>, unknown>,
	>(a: A, b: B): boolean {
		return a.id.equals(b.id);
	}

	abstract toObject(): Readonly<EntityProps>;
}

export abstract class UpdatableEntity<
	EntityId extends ValueObject<unknown>,
	EntityProps,
> extends Entity<EntityId, EntityProps> {
	updatedAt?: Date | null;

	protected constructor(
		props: WithoutDates<CreateEntityProps<EntityId, EntityProps>>,
	) {
		super(props);
		this.updatedAt = null;
	}

	protected touch(): void {
		this.updatedAt = new Date();
	}
}

export abstract class DeletableEntity<
	EntityId extends ValueObject<unknown>,
	EntityProps,
> extends UpdatableEntity<EntityId, EntityProps> {
	deletedAt?: Date | null;

	protected constructor(
		props: WithoutDates<CreateEntityProps<EntityId, EntityProps>>,
	) {
		super(props);
		this.deletedAt = null;
	}

	protected touch(): void {
		super.touch();
	}

	softDelete(): void {
		this.deletedAt = new Date();
		this.touch();
	}

	isDeleted(): boolean {
		return this.deletedAt !== null;
	}
}
