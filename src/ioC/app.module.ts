import { Module } from '@nestjs/common';

import { CoreModule } from '@/core/core.module';

import { UsersModule } from '@/modules/users/users.module';

@Module({
	imports: [CoreModule, UsersModule],
	providers: [],
	controllers: [],
	exports: [],
})
export class AppModule {}
