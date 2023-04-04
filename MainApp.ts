import express, { Application, NextFunction, Request, Response } from "express";
import cookieSession from "cookie-session";
import { ErrorHandler, HttpCode } from "./Utils/ErrorHandler";
import { errorDevHandlers } from "./Utils/DevError";
import user from "./Routes/userRoutes";
import auths from "./Routes/auth.route";
export const MainApp = (app: Application) => {
	//calling all our middlewares
	app
		.use(express.json())

		.use(
			cookieSession({
				name: "session",
				keys: ["testWeb"],
				maxAge: 2 * 60 * 60 * 100,
			}),
		)

		.use((req: Request, res: Response, next: any) => {
			if (req.session && !req.session.regenerate) {
				req.session.regenerate = (cb: any) => {
					cb();
				};
			}

			if (req.session && !req.session.save) {
				req.session.save = (cb: any) => {
					cb();
				};
			}

			next();
		})

		.get("/", (req: Request, res: Response) => {
			res.status(200).json({
				message: "api is ready for consumption",
			});
		})

		.use("/api", user)
		.use("/api/auth", auths)

		.all("*", (req: Request, res: Response, next: NextFunction) => {
			next(
				new ErrorHandler({
					message: `this route ${req.originalUrl} does not exist`,
					httpCode: HttpCode.NOT_FOUND,
					isOperational: true,
				}),
			);
		})

		.use(errorDevHandlers);
};
