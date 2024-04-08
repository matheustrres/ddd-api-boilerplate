import { type EntityId } from '../../entities/entity-id';

export interface IDomainEvent {
	name: string;
	occurredAt: Date;
	getAggregateId(): EntityId;
}
