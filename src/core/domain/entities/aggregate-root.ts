import { Entity } from './entity';

import { type IDomainEvent } from '../events/contracts/domain-event';
import { DomainEvents } from '../events/domain-events';

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
