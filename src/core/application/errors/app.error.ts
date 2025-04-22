export class ApplicationError extends Error {
	readonly message: string;
	readonly code: number;

	constructor(message: string, code: number) {
		super(message);

		this.message = message;
		this.code = code;

		Error.captureStackTrace(this, this.constructor);
	}

	toObject(): { code: number; message: string } {
		return {
			code: this.code,
			message: this.message,
		};
	}
}
