import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = express.Router();

router.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	}),
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google"),
	(req: any, res) => {
		res.redirect(`http://127.0.0.1:5173/sucess-page?token=${req?.user}`);
	},
);

export default router;
