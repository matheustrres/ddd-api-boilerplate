import { type DomainEvent } from './domain-event';

export abstract class EventEmitter {
	abstract emit<T = unknown>(domainEvent: DomainEvent<T>): boolean;
}
