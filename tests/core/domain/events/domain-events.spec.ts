import { deepStrictEqual, equal, strictEqual } from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { AggregateRoot } from '@/core/domain/aggregate-root';
import { EntityId } from '@/core/domain/entity-id';
import { type IDomainEvent } from '@/core/domain/events/domain-event';
import { DomainEvents } from '@/core/domain/events/domain-events';

class TestingEvent implements IDomainEvent {
	name = 'TestingEvent';
	occurredAt = new Date();

	constructor(readonly ag: AggregateRoot<unknown>) {}

	getAggregateId() {
		return this.ag.id;
	}
}

class TestingAggregate extends AggregateRoot<{
	username: string;
	email: string;
}> {
	constructor(props: { username: string; email: string }) {
		super({
			id: new EntityId(),
			props,
		});

		this.addDomainEvent(new TestingEvent(this));
	}
}

describe('DomainEvents', () => {
	let ag: AggregateRoot<{
		username: string;
		email: string;
	}>;

	beforeEach(() => {
		ag = new TestingAggregate({
			username: 'John Doe',
			email: 'john.doe@gmail.com',
		});

		DomainEvents.clearHandlers();
		DomainEvents.clearMarkedAggregates();
	});

	it('should clear registered handlers', () => {
		const cb = () => {};

		DomainEvents.register(cb, TestingEvent.name);
		DomainEvents.clearHandlers();

		const handlers = DomainEvents.getHandlers();

		equal(handlers.size, 0);
	});

	it('should dispatch events for an aggregate', () => {
		let eventWasDispatched = false;

		const cb = () => {
			eventWasDispatched = true;
		};

		DomainEvents.register(cb, TestingEvent.name);
		DomainEvents.markAggregateForDispatch(ag);
		DomainEvents.dispatchEventsForAggregateById(ag.id);

		equal(eventWasDispatched, true);
	});

	it('should not dispatch events if aggregate is not marked', () => {
		let eventWasDispatched = false;

		const cb = () => {
			eventWasDispatched = true;
		};

		DomainEvents.register(cb, TestingEvent.name);
		DomainEvents.dispatchEventsForAggregateById(ag.id);

		equal(eventWasDispatched, false);
	});

	it('should mark the aggregate for dispatch if it is not already marked', () => {
		DomainEvents.markAggregateForDispatch(ag);

		strictEqual(DomainEvents.getMarkedAggregates().length, 1);
	});

	it('should not duplicate aggregate marking', () => {
		DomainEvents.markAggregateForDispatch(ag);
		DomainEvents.markAggregateForDispatch(ag);

		strictEqual(DomainEvents.getMarkedAggregates().length, 1);
	});

	it('should register a callback for an event', () => {
		const cb = () => {};

		DomainEvents.register(cb, TestingEvent.name);

		const handlers = DomainEvents.getHandlers();
		const testingHandler = handlers.get(TestingEvent.name);

		deepStrictEqual(testingHandler, [cb]);
	});
});
