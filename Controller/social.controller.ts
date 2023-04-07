import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../Model/UserModel";
import jwt from "jsonwebtoken";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
	new GoogleStrategy(
		{
			clientID:
				"526763411906-p1sbanrkl0adlhtfsafvch1pnucniqp3.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "http://localhost:1400/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, cb) => {
			if (profile?._json?.email_verified) {
				const user = await UserModel.findOne({ email: profile?._json?.email });
				const token = jwt.sign(
					{
						_id: user?._id,
					},
					"xsfjgnzjf-snsdjrbh-sfghhhzk463q74t4-fxgnsdfhsdfjj",
					{ expiresIn: "7d" },
				);

				if (user) {
					return cb(null, token);
				}

				const res = await UserModel.create({
					name: profile?.displayName,
					email: profile?._json?.email,
					password: profile?._json?.email,
				});

				const token2 = jwt.sign(
					{
						_id: res?._id,
					},
					"xsfjgnzjf-snsdjrbh-sfghhhzk463q74t4-fxgnsdfhsdfjj",
					{ expiresIn: "7d" },
				);

				return cb(null, token2);
			} else {
				throw new Error("No email address found in the user's Google profile.");
			}
		},
	),
);

passport.use(
	new GitHubStrategy(
		{
			clientID: "67ab69f96d413b96af64",
			clientSecret: "47e6bb9beceae58cfc2f9224f3292e926fbf6932",
			callbackURL: "/auth/github/callback",
			scope: ["user:email"],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const email = (profile?.emails?.[0]?.value || "").toLowerCase();

				if (!email) {
					throw new Error("User email is not available.");
				}

				const user = await UserModel.findOne({ email });

				if (user) {
					const token = jwt.sign(
						{ _id: user._id },
						"xsfjgnzjf-snsdjrbh-sfghhhzk463q74t4-fxgnsdfhsdfjj",
						{ expiresIn: "7d" },
					);
					return done(null, token);
				}

				const newUser = await UserModel.create({
					name: profile?.displayName,
					email,
					password: email,
				});

				const token = jwt.sign(
					{ _id: newUser._id },
					"xsfjgnzjf-snsdjrbh-sfghhhzk463q74t4-fxgnsdfhsdfjj",
					{ expiresIn: "7d" },
				);

				return done(null, token);
			} catch (error) {
				return done(error);
			}
		},
	),
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user: any, done) => {
	done(null, user);
});
