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

router.get(
	"/auth/github",
	passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
	"/auth/github/callback",
	passport.authenticate("github", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect(`http://127.0.0.1:5173/sucess-page?token=${req?.user}`);
	},
);

export default router;
