import { type Entity } from '@/core/domain/entities/entity';

export interface Repository<DomainEntity extends Entity<unknown>> {
	delete(id: string): Promise<void>;
	findById(id: string): Promise<DomainEntity | null>;
	find(): Promise<DomainEntity[]>;
	upsert(DomainEntity: DomainEntity): Promise<void>;
}
