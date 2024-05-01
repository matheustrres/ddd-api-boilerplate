import { Entity } from '@/core/domain/entity';
import { type IDomainEvent } from '@/core/domain/events/domain-event';
import { DomainEvents } from '@/core/domain/events/domain-events';

export class AggregateRoot<T> extends Entity<T> {
	#domainEvents: IDomainEvent[] = [];

	protected validate(): void {}

	get domainEvents() {
		return this.#domainEvents;
	}

	protected addDomainEvent(event: IDomainEvent) {
		this.#domainEvents.push(event);
		DomainEvents.markAggregateForDispatch(this);
	}

	clearEvents() {
		this.#domainEvents = [];
	}
}
