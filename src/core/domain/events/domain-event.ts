import { type EntityId } from '../entity-id';

export interface IDomainEvent {
	name: string;
	occurredAt: Date;
	getAggregateId(): EntityId;
}
