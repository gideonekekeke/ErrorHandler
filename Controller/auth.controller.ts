import UserModel from "../Model/UserModel";
import { check, validationResult } from "express-validator";
import { Request, Response } from "express";
import { ErrorHandler, HttpCode } from "../Utils/ErrorHandler";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import {
	AccountVerification,
	ForgotPasswordVerification,
} from "../Utils/EmailConfig";
import bcrypt from "bcrypt";

const GOOGLE_SECRET = "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";

const GOOGLE_ID =
	"526763411906-dab729ct9f2tsuqpmb6uv30t7kp9a584.apps.googleusercontent.com";

const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground";

const GOOGLE_REFRESHTOKEN =
	"1//04Y5AsDKQNfTvCgYIARAAGAQSNwF-L9IrlXB3BZV31aPR2nzemx4DkcLXimEb9aD4eIngPXPQ_gW2-Rt8N3LdFNGA-gkmDKTc0Sc";

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
			// console.log("i ran");
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

export const forgotPass = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessage = errors.array().map((props) => props.msg)[0];

			return res.status(HttpCode.NOT_FOUND).json({
				message: errorMessage,
			});
		} else {
			const user = await UserModel.findOne({ email });

			if (!user) {
				return res.status(HttpCode.BAD_REQUEST).json({
					message: "user with this email does not exists",
				});
			} else {
				const token = jwt.sign(
					{
						_id: user._id,
					},
					"xsfjgnzjf-snsdjrbh-sfghhhzk463q74t4-fxgnsdfhsdfjj",
					{
						expiresIn: "10m",
					},
				);

				await user.updateOne({
					resetPasswordLink: token,
				});

				ForgotPasswordVerification(token, email, user?.name)
					.then(() => {
						res.status(HttpCode.OK).json({
							message: "check your email to complete this operation",
						});
					})
					.catch((err) => {
						return res.status(HttpCode.BAD_REQUEST).json({
							message: err,
						});
					});
			}
		}
	} catch (err) {
		return new ErrorHandler({
			name: "forgot password error",
			message: "an error occured why  reseting your password",
			httpCode: HttpCode.NOT_FOUND,
			isOperational: false,
		});
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { resetPasswordLink, newPassword } = req.body;

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newPassword, salt);

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessage = errors.array().map((props) => props.msg)[0];
			return res.status(HttpCode.NOT_FOUND).json({
				message: errorMessage,
			});
		} else {
			if (resetPasswordLink) {
				const user = await UserModel.findOne({ resetPasswordLink });
				if (user) {
					await user.updateOne({
						password: hash,
						resetPasswordLink: "",
					});

					return res.status(HttpCode.OK).json({
						message: "successfull",
					});
				} else {
					return res.status(HttpCode.NOT_FOUND).json({
						message: "dont have permission for this",
					});
				}
			}
		}
	} catch (err) {
		return new ErrorHandler({
			name: "forgot password error",
			message: "an error occured why  reseting your password",
			httpCode: HttpCode.NOT_FOUND,
			isOperational: false,
		});
	}
};

const client = new OAuth2Client(
	"429547593894-eoslv48mp6o2rbpv0lhu8kv2vb8s6dik.apps.googleusercontent.com",
);

export const GoogleLogin = async (req: Request, res: Response) => {
	try {
		const { idToken } = req.body;

		client
			.verifyIdToken({
				idToken,
				audience:
					"429547593894-eoslv48mp6o2rbpv0lhu8kv2vb8s6dik.apps.googleusercontent.com",
			})
			.then((response) => {
				res.json(response);
			});
	} catch (err) {
		return new ErrorHandler({
			name: "forgot password error",
			message: "an error occured why  reseting your password",
			httpCode: HttpCode.NOT_FOUND,
			isOperational: false,
		});
	}
};
