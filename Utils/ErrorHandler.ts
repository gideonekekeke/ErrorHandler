export enum HttpCode {
	OK = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,
	INTERNAL_SERVER_ERROR = 500,
}

export interface DefineTypes {
	name?: string;
	message: string;
	isOperational: boolean;
	httpCode: HttpCode;
}

export class ErrorHandler extends Error {
	public readonly name: string;
	public readonly isOperational: boolean = true;
	public readonly httpCode: HttpCode;

	constructor(args: DefineTypes) {
		super(args.message);

		Object.setPrototypeOf(this, new.target.prototype);
		this.name = args.name || "Error";
		this.httpCode = args.httpCode;

		if (args.isOperational !== undefined) {
			this.isOperational = args.isOperational;
		}

		Error.captureStackTrace(this);
	}
}
