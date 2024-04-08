import { EntityId } from './entity-id';

import { Guard } from '../logic/guard';

export abstract class Entity<Props> {
	readonly id: EntityId;
	readonly createdAt: Date;

	protected readonly props: Props;

	protected abstract validate(): void;

	constructor(props: Props, id?: EntityId) {
		this.#ensureProps(props);

		this.props = props;

		this.validate();

		this.id = id ?? new EntityId();
		this.createdAt = new Date();
	}

	copy(): Props {
		const copyObj = {
			id: this.id,
			...this.props,
			createdAt: this.createdAt,
		};

		return Object.freeze(copyObj);
	}

	static equals(a: Entity<unknown>, b: Entity<unknown>): boolean {
		if (!Entity.isEntity(a) || !Entity.isEntity(b)) return false;
		if (a === b) return true;

		return a.id!.equalsTo(b.id);
	}

	static isEntity(entity: unknown): entity is Entity<unknown> {
		return entity instanceof Entity;
	}

	#ensureProps(props: Props): void {
		if (Guard.isEmpty(props)) {
			throw new Error('Entity properties should not be empty');
		}

		if (typeof props !== 'object') {
			throw new TypeError('Entity properties should be an object');
		}
	}
}

export abstract class UpdatableEntity<Props> extends Entity<Props> {
	updatedAt?: Date;

	protected touch(): void {
		this.updatedAt = new Date();
	}
}
