import { type Repository } from '@/core/domain/contracts/repository';
import { type Entity } from '@/core/domain/entities/entity';

export class InMemoCoreRepository<E extends Entity<unknown>>
	implements Repository<E>
{
	items: E[] = [];

	async delete(id: string): Promise<void> {
		const item = this.items.findIndex((i) => i.id.toString() === id);

		this.items.splice(item, 1);
	}

	async find(): Promise<E[]> {
		return this.items;
	}

	async findById(id: string): Promise<E | null> {
		return this.items.find((i) => i.id.toString() === id) || null;
	}

	async upsert(entity: E): Promise<void> {
		const i = this.items.findIndex((i) => i.id.equalsTo(entity.id));

		if (i !== -1) {
			this.items[i] = entity;
		} else {
			this.items.push(entity);
		}
	}
}
