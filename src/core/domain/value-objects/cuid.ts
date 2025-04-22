import { createId, isCuid } from '@paralleldrive/cuid2';

import { StringVO } from './primitives/string';

import { DomainException } from '../exceptions/domain.exception';

export class CuidVO extends StringVO {
	private constructor(value: string) {
		super(value);
	}

	static createCuid(): CuidVO {
		return new CuidVO(createId());
	}

	static createFrom(value: string): CuidVO {
		if (!isCuid(value)) {
			throw new DomainException(`Invalid CUID: ${value}`);
		}
		return new CuidVO(value);
	}
}
