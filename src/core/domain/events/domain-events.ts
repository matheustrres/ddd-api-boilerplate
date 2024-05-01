import { type AggregateRoot } from '@/core/domain/aggregate-root';
import { type EntityId } from '@/core/domain/entity-id';
import { type IDomainEvent } from '@/core/domain/events/domain-event';

type DomainEventCallback = (event: unknown) => void;

export class DomainEvents {
	static #handlers = new Map<string, DomainEventCallback[]>();
	static #markedAggregates: AggregateRoot<unknown>[] = [];

	static shouldRun = true;

	static getHandlers() {
		return DomainEvents.#handlers;
	}

	static getMarkedAggregates() {
		return DomainEvents.#markedAggregates;
	}

	static #dispatch(event: IDomainEvent) {
		if (!DomainEvents.shouldRun) {
			return;
		}

		const eventClassName = event.constructor.name;
		const handlers = DomainEvents.#handlers.get(eventClassName);

		if (handlers) {
			for (const handler of handlers) {
				handler(event);
			}
		}
	}

	static #dispatchAggregateEvents<T = unknown>(aggregate: AggregateRoot<T>) {
		aggregate.domainEvents.forEach(DomainEvents.#dispatch);
	}

	static #findMarkedAggregateById(id: EntityId) {
		return DomainEvents.#markedAggregates.find((ag) => ag.id.equalsTo(id));
	}

	static #removeAggregateFromMarkedDispatchList(
		aggregate: AggregateRoot<unknown>,
	) {
		const index = DomainEvents.#markedAggregates.findIndex((ag) =>
			ag.id.equalsTo(aggregate.id),
		);

		DomainEvents.#markedAggregates.splice(index, 1);
	}

	static clearHandlers() {
		DomainEvents.#handlers = new Map<string, DomainEventCallback[]>();
	}

	static clearMarkedAggregates() {
		DomainEvents.#markedAggregates = [];
	}

	static dispatchEventsForAggregateById(id: EntityId) {
		const aggregate = DomainEvents.#findMarkedAggregateById(id);

		if (aggregate) {
			DomainEvents.#dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			DomainEvents.#removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	static markAggregateForDispatch<T = unknown>(aggregate: AggregateRoot<T>) {
		const aggregateFound = !!DomainEvents.#findMarkedAggregateById(
			aggregate.id,
		);

		if (!aggregateFound) {
			DomainEvents.#markedAggregates.push(aggregate);
		}
	}

	static register(cb: DomainEventCallback, eventClassName: string) {
		let events = DomainEvents.#handlers.get(eventClassName);

		if (!events) {
			events = [];
			DomainEvents.#handlers.set(eventClassName, events);
		}

		events.push(cb);
	}
}
