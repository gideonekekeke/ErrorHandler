import { Request, Response, NextFunction } from "express";
import { HttpCode, ErrorHandler } from "./ErrorHandler";

const devErrorHandler = (err: ErrorHandler, res: Response) => {
	res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
		status: err.httpCode,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

export const errorDevHandlers = (
	err: ErrorHandler,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	devErrorHandler(err, res);
};
