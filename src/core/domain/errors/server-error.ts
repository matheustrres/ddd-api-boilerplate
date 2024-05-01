export class ServerError extends Error {
	readonly message: string;
	readonly statusCode: number;

	constructor(message: string, statusCode = 500) {
		super(message);

		this.message = message;
		this.statusCode = statusCode;

		Error.captureStackTrace(this, this.constructor);
	}
}
