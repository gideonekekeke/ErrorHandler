import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile"],
	}),
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google"),
	(req, res) => {
		res.redirect("/dashboard");
	},
);

export default router;
