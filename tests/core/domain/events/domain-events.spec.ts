import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { AggregateRoot } from '@/core/domain/entities/aggregate-root';
import { type IDomainEvent } from '@/core/domain/events/contracts/domain-event';
import { DomainEvents } from '@/core/domain/events/domain-events';

class TestingEvent implements IDomainEvent {
	name = 'TestingEvent';
	occurredAt = new Date();

	constructor(readonly ag: AggregateRoot<unknown>) {}

	getAggregateId() {
		return this.ag.id;
	}
}

class TestingAggregate extends AggregateRoot<any> {
	constructor(props: any) {
		super(props);

		this.addDomainEvent(new TestingEvent(this));
	}
}

describe('DomainEvents', () => {
	let ag: AggregateRoot<unknown>;

	beforeEach(() => {
		ag = new TestingAggregate({
			userName: 'John Doe',
		});

		DomainEvents.clearHandlers();
		DomainEvents.clearMarkedAggregates();
	});

	it('should clear registered handlers', () => {
		const cb = () => {};

		DomainEvents.register(cb, TestingEvent.name);
		DomainEvents.clearHandlers();

		const handlers = DomainEvents.getHandlers();

		assert.equal(handlers.size, 0);
	});

	it('should dispatch events for an aggregate', () => {
		let eventWasDispatched = false;

		const cb = () => {
			eventWasDispatched = true;
		};

		DomainEvents.register(cb, TestingEvent.name);
		DomainEvents.markAggregateForDispatch(ag);
		DomainEvents.dispatchEventsForAggregateById(ag.id);

		assert.equal(eventWasDispatched, true);
	});

	it('should not dispatch events if aggregate is not marked', () => {
		let eventWasDispatched = false;

		const cb = () => {
			eventWasDispatched = true;
		};

		DomainEvents.register(cb, TestingEvent.name);
		DomainEvents.dispatchEventsForAggregateById(ag.id);

		assert.equal(eventWasDispatched, false);
	});

	it('should mark the aggregate for dispatch if it is not already marked', () => {
		DomainEvents.markAggregateForDispatch(ag);

		assert.strictEqual(DomainEvents.getMarkedAggregates().length, 1);
	});

	it('should not duplicate aggregate marking', () => {
		DomainEvents.markAggregateForDispatch(ag);
		DomainEvents.markAggregateForDispatch(ag);

		assert.strictEqual(DomainEvents.getMarkedAggregates().length, 1);
	});

	it('should register a callback for an event', () => {
		const cb = () => {};

		DomainEvents.register(cb, TestingEvent.name);

		const handlers = DomainEvents.getHandlers();
		const testingHandler = handlers.get(TestingEvent.name);

		assert.deepStrictEqual(testingHandler, [cb]);
	});
});
