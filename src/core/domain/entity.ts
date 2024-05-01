import { type EntityId } from '@/core/domain/entity-id';
import { Guard } from '@/core/domain/logic/guard';

type CreateEntityProps<Props> = {
	id: EntityId;
	props: Props;
};

export abstract class Entity<Props> {
	readonly id: EntityId;
	readonly createdAt: Date;

	protected readonly props!: Props;

	protected abstract validate(): void;

	constructor({ id, props }: CreateEntityProps<Props>) {
		this.#ensureProps(props);

		this.props = props;

		this.validate();

		this.id = id;
		this.createdAt = new Date();
	}

	copy(): Props {
		const copyObj = {
			...this.props,
		};

		return Object.freeze(copyObj);
	}

	#ensureProps(props: Props): void {
		const isObject = Guard.isObject('entityProps', props);

		if (isObject.isFailure) {
			throw new Error(isObject.getError());
		}

		if (typeof props !== 'object') {
			throw new TypeError('Entity properties should be an object');
		}
	}
}
