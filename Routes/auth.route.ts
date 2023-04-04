import { registerUser } from "../Controller/auth.controller";
import express from "express";
import { SignUpValid } from "../helpers/valid";

const router = express.Router();

router.post("/register", SignUpValid, registerUser);

export default router;
