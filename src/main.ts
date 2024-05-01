import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from '@/ioC/app.module';

enum ExitStatus {
	FAILURE = 1,
	SUCCESS = 0,
}

enum ExitMessage {
	FAILURE = 'App exited with an error:',
	SUCCESS = 'App exited successfully',
	UNCAUGHT_EXCEPTION = 'App exited due to an uncaught exception:',
	UNHANDLED_REJECTION = 'App exited due to an unhandled rejection:',
}

function exitWithSuccess(): never {
	console.log(ExitMessage.SUCCESS);
	process.exit(ExitStatus.SUCCESS);
}

function exitWithFailure(message?: string, error?: unknown): never {
	console.error(message, error);
	process.exit(ExitStatus.FAILURE);
}

process.on('uncaughtException', (error: Error): never =>
	exitWithFailure(ExitMessage.UNCAUGHT_EXCEPTION, error),
);

process.on(
	'unhandledRejection',
	(reason: unknown, _promise: Promise<unknown>) => {
		exitWithFailure(ExitMessage.UNHANDLED_REJECTION, reason);
	},
);

(async () => {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	app.enableCors({
		origin: ['*'],
		credentials: true,
		methods: 'GET,PUT,PATCH,POST,DELETE',
		allowedHeaders:
			'Content-Type,Accept,Authorization,Access-Control-Allow-Origin',
	});

	const port = parseInt(process.env['APP_PORT'] as string) || 3333;

	await app.listen(port, 'localhost');

	const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

	for (const signal of exitSignals) {
		process.on(signal, async () => {
			try {
				await app.close();
				exitWithSuccess();
			} catch (error) {
				exitWithFailure(ExitMessage.FAILURE, error);
			}
		});
	}
})();
