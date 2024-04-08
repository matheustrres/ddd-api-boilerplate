import { type Entity } from '@/core/domain/entities/entity';

export interface Repository<E extends Entity<unknown>> {
	delete(id: string): Promise<void>;
	findById(id: string): Promise<E | null>;
	find(): Promise<E[]>;
	upsert(entity: E): Promise<void>;
}
