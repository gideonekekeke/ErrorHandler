import UserModel from "../Model/UserModel";
import { check, validationResult } from "express-validator";
import { Request, Response } from "express";
import { ErrorHandler, HttpCode } from "../Utils/ErrorHandler";
import jwt from "jsonwebtoken";

import { AccountVerification } from "../Utils/EmailConfig";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;

		const errors = validationResult(req);
		// console.log(errors);

		// iterating through the errors and reading the first error message from the array
		if (!errors.isEmpty()) {
			const myError = errors.array().map((props) => props.msg)[0];
			return res.status(HttpCode.NOT_FOUND).json({
				message: myError,
			});
		} else {
			const user = await UserModel.findOne({ email: email }).exec();

			if (user) {
				return res.status(HttpCode.NOT_FOUND).json({
					message: `${email} already exists in our database`,
				});
			}

			const token = jwt.sign(
				{
					name,
					email,
					password,
				},
				"xsfjgnzjf-snsdjrbh-sfghhhzk463q74t4-fxgnsdfhsdfjj",
				{ expiresIn: "5m" },
			);

			AccountVerification(token, email, name)
				.then((result) => {
					return res.status(HttpCode.OK).json({
						message: `an account verification messsage has been sent to ${email}, please go and confirm`,
						result: result,
					});
				})
				.catch((err) => {
					return res.status(HttpCode.NOT_FOUND).json(err);
				});
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

export const verifyActivationAccount = async (req: Request, res: Response) => {
	try {
		const token = req.params.tokenID;

		const salt = await bcrypt.genSalt(10);

		if (token) {
			jwt.verify(
				token,
				"xsfjgnzjf-snsdjrbh-sfghhhzk463q74t4-fxgnsdfhsdfjj",
				async (err, decoded) => {
					if (err) {
						return res.status(HttpCode.BAD_REQUEST).json({
							message: "token expired or invalid token",
						});
					} else {
						const { name, email, password }: any = jwt.decode(token);
						console.log("this is password", password);

						const hash = await bcrypt.hash(password, salt);

						await UserModel.create({
							name,
							email,
							password: hash,
						});

						return res.status(HttpCode.OK).json({
							message: "Verification success, go and Login.",
						});
					}
				},
			);
		} else {
			return res.status(HttpCode.BAD_REQUEST).json({
				message: "you dont have permission for this operation",
			});
		}
	} catch (err) {
		return new ErrorHandler({
			name: "verification error",
			message: "cannot verify due to network or server downtime",
			httpCode: HttpCode.NOT_FOUND,
			isOperational: false,
		});
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const error = validationResult(req);

		if (!error.isEmpty()) {
			const readError = error.array().map((props) => props.msg)[0];
			return res.status(HttpCode.BAD_REQUEST).json({
				message: readError,
			});
		} else {
			const user: any = await UserModel.findOne({ email: email }).exec();
			console.log("i ran");
			const checkPassword = await bcrypt.compare(password, user?.password!);

			if (!checkPassword) {
				return res.status(HttpCode.BAD_REQUEST).json({
					message: "password is incorrect",
				});
			} else if (user) {
				const token = jwt.sign(
					{
						_id: user?._id,
					},
					"xsfjgnzjf-snsdjrbh-sfghhhzk463q74t4-fxgnsdfhsdfjj",
					{
						expiresIn: "7d",
					},
				);
				return res.status(HttpCode.OK).json({
					message: "successfull",
					token,
				});
			} else {
				return res.status(HttpCode.NOT_FOUND).json({
					message: "user with this account does not exist",
				});
			}
		}
	} catch (err) {
		return new ErrorHandler({
			name: "login error",
			message: "cannot login user due to an issue",
			httpCode: HttpCode.NOT_FOUND,
			isOperational: false,
		});
	}
};
