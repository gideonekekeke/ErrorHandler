import { Request, Response, NextFunction } from "express";
import UserModel from "../Model/UserModel";
import { asyncHandler } from "../Utils/AsyncHandler";
import { sendMailToUsers } from "../Utils/EmailConfig";

export const createUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { name, email } = req.body;

			const user = await UserModel.create({
				name,
				email,
			});

			sendMailToUsers(user)
				.then((result) => {
					console.log("message has been sent", result);
				})
				.catch((err) => console.log(err));

			return res.status(200).json({
				message: "success",
				data: user,
			});
		} catch (err) {
			return res.status(err);
		}
	},
);

export const getUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const getting = await UserModel.find();

			return res.status(200).json({
				message: "success",
				data: getting,
			});
		} catch (err) {
			return res.status(err);
		}
	},
);
