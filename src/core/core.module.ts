import { EnvModule } from '@/shared/modules/env/env.module';
import { EnvService } from '@/shared/modules/env/env.service';
import { SentryMonitorModule } from '@/shared/modules/monitor/sentry-monitor.module';
import { type SentryMonitorModuleOptions } from '@/shared/modules/monitor/sentry-monitor.types';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { DateService } from './application/services/date.service';
import { RetryService } from './application/services/retry.service';
import { NodeEnvEnum } from './domain/enums/node-env';
import { EventEmitter } from './domain/events/event-emitter';
import { EventEmitterAdapter } from './infra/adapters/events/event-emitter';
import { DateFnsDateService } from './infra/adapters/services/date.service';

@Global()
@Module({
	imports: [
		HttpModule.register({ global: true }),
		SentryMonitorModule.forRootAsync({
			imports: [EnvModule],
			useFactory: (envService: EnvService): SentryMonitorModuleOptions => {
				const nodeEnv = envService.getKeyOrThrow('NODE_ENV');
				const isProduction = nodeEnv === 'production';

				return {
					dsn: envService.getKeyOrThrow('SENTRY_DSN'),
					environment: nodeEnv,
					enabled: isProduction,
					tracesSampleRate: isProduction ? 0.1 : 1.0,
					debug: nodeEnv === NodeEnvEnum.Debug,
					integrations: [nodeProfilingIntegration()],
					profilesSampleRate: 1.0,
				};
			},
			inject: [EnvService],
		}),
		EventEmitterModule.forRoot({
			global: true,
			ignoreErrors: false,
		}),
	],
	providers: [
		{
			provide: DateService,
			useClass: DateFnsDateService,
		},
		{
			provide: EventEmitter,
			useClass: EventEmitterAdapter,
		},
		RetryService,
	],
	exports: [DateService, EventEmitter, RetryService],
})
export class CoreModule {}
