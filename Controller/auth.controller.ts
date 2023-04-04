import UserModel from "../Model/UserModel";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { ErrorHandler, HttpCode } from "../Utils/ErrorHandler";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;

		const errors = validationResult(req);
		console.log(errors);

		// iterating through the errors and reading the first error message from the array
		if (!errors.isEmpty()) {
			const myError = errors.array().map((props) => props.msg)[0];
			return res.status(HttpCode.NOT_FOUND).json({
				message: myError,
			});
		} else {
			const user = await UserModel.findOne({ email }).exec();

			if (user) {
				return res.status(HttpCode.NOT_FOUND).json({
					message: `${email} already exists in our database`,
				});
			}

			return res.json(
				jwt.sign(
					{
						name,
						email,
						password,
					},
					"xsfjgnzjf-snsdjrbh-sfghhhzk463q74t4-fxgnsdfhsdfjj",
					{
						expiresIn: "5m",
					},
				),
			);
		}
	} catch (err) {
		return new ErrorHandler({
			name: "register error",
			message: "cannot register user",
			httpCode: HttpCode.NOT_FOUND,
			isOperational: false,
		});
	}
};
