import { ServerError } from '@/core/domain/errors/server-error';

export class InvalidOperationError extends ServerError {
	constructor(message: string, statusCode = 400) {
		super(`InvalidOperation: ${message}`, statusCode);
	}
}
