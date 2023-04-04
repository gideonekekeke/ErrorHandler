import { check } from "express-validator";

export const SignUpValid = () => {
	check("name", "Name is required")
		.notEmpty()
		.isLength({
			min: 4,
			max: 32,
		})
		.withMessage("name must be between 3 to 32 characters");
	check("email", "email is required")
		.isEmail()
		.withMessage("Must be a valid email address");
	check("password", "password is required").notEmpty(),
		check("password")
			.isLength({
				min: 6,
			})
			.withMessage("password must contain atleast 6 characters")
			.matches(/\d/)
			.withMessage("password must contain a number");
};

export const LoginValid = () => {
	check("email", "email is required")
		.isEmail()
		.isEmpty()
		.withMessage("Must be a valid email address");

	check("password", "password is required")
		.notEmpty()
		.isLength({
			min: 6,
		})
		.withMessage("passowrd must have at least 6 characters")
		.matches(/\d/)
		.withMessage("password must contain a number");
};
