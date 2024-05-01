import { type Entity } from '@/core/domain/entities/entity';

export interface Mapper<
	DomainEntity extends Entity<unknown>,
	Model extends object,
> {
	toDomain(model: Model): DomainEntity;
	toInfra(domainEntity: DomainEntity): Model;
}
