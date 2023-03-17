import { Request, Response, NextFunction } from "express";
import UserModel from "../Model/UserModel";
import { asyncHandler } from "../Utils/AsyncHandler";

export const createUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { name, email } = req.body;

			const creating = await UserModel.create({
				name,
				email,
			});

			return res.status(200).json({
				message: "success",
				data: creating,
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
