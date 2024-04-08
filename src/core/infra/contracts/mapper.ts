import { type Entity } from '@/core/domain/entities/entity';

export interface Mapper<
	DomainEntity extends Entity<unknown>,
	InfraEntity extends object,
> {
	toDomain(i: InfraEntity): DomainEntity;
	toInfra(d: DomainEntity): InfraEntity;
}
