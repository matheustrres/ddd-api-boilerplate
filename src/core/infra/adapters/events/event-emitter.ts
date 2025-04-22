import { Injectable } from '@nestjs/common';
import { type EventEmitter2 } from '@nestjs/event-emitter';

import { type DomainEvent } from '@/core/domain/events/domain-event';
import { type EventEmitter } from '@/core/domain/events/event-emitter';

@Injectable()
export class EventEmitterAdapter implements EventEmitter {
	constructor(private readonly eventEmitter: EventEmitter2) {}

	emit<T = unknown>(domainEvent: DomainEvent<T>): boolean {
		return this.eventEmitter.emit(domainEvent.name, domainEvent);
	}
}
