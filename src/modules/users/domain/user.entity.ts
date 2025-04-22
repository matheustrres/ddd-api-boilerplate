import { type CreateEntityProps, UpdatableEntity } from '@/core/domain/entity';
import { StringIdVO } from '@/core/domain/value-objects/string-id';

type UserEntityProps = {
	name: string;
	email: string; // create EmailVO, primitives are weak
	password: string; // create PasswordVO
	isActive: boolean;
};

type UserEntityConstructorProps = CreateEntityProps<
	StringIdVO,
	UserEntityProps
>;

export class UserEntity extends UpdatableEntity<StringIdVO, UserEntityProps> {
	private constructor(props: UserEntityConstructorProps) {
		super(props);
	}

	static create(props: UserEntityProps): UserEntity {
		return new UserEntity({
			id: StringIdVO.createId(),
			props,
			createdAt: new Date(),
			updatedAt: null,
			deletedAt: null,
		});
	}

	static restore(props: UserEntityConstructorProps): UserEntity {
		return new UserEntity(props);
	}

	activate(): void {
		this.props.isActive = true;
		this.touch();
	}

	deactivate(): void {
		this.props.isActive = false;
		this.touch();
	}

	toObject(): Readonly<UserEntityProps> {
		return {
			...this.props,
		};
	}
}
