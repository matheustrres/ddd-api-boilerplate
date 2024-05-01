import { randomUUID } from 'node:crypto';

import { type UniqueId } from '@/core/domain/ports/unique-id';

export class EntityId implements UniqueId<EntityId> {
	readonly #value: string;

	constructor(value?: string) {
		this.#value = value || randomUUID();
	}

	equalsTo(id: EntityId): boolean {
		return this.toString() === id.toString();
	}

	toString(): string {
		return this.#value;
	}
}
