import {
	forgotPass,
	loginUser,
	registerUser,
	resetPassword,
	verifyActivationAccount,
} from "../Controller/auth.controller";
import express from "express";
import {
	LoginValid,
	SignUpValid,
	ForgotPasswordValid,
	ResetPasswordValid,
} from "../helpers/valid";

const router = express.Router();

router.post("/register", SignUpValid, registerUser);
router.get("/verify/:tokenID", verifyActivationAccount);
router.post("/login", LoginValid, loginUser);
router.post("/forgotPass", ForgotPasswordValid, forgotPass);
router.post("/resetPass", ResetPasswordValid, resetPassword);

export default router;
