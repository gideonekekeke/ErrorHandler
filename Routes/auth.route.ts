import {
	loginUser,
	registerUser,
	verifyActivationAccount,
} from "../Controller/auth.controller";
import express from "express";
import { LoginValid, SignUpValid } from "../helpers/valid";

const router = express.Router();

router.post("/register", SignUpValid, registerUser);
router.get("/verify/:tokenID", verifyActivationAccount);
router.post("/login", LoginValid, loginUser);

export default router;
