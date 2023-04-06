import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../Model/UserModel";
import jwt from "jsonwebtoken";

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

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user: any, done) => {
	done(null, user);
});

export const handleGoogleAuthCallback = async (req, res) => {
	try {
		passport.authenticate("google", async (err, data) => {
			if (err) {
				return res.status(500).json({
					message: "An error occurred while authenticating with Google.",
				});
			}

			// Get the user and token from the authentication result
			const { user, token } = data;

			// Store the token in localStorage

			// res.json(token);

			// Redirect the user to the dashboard
			res.redirect(`http://127.0.0.1:5173/?token=${token}`);
		})(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
};
