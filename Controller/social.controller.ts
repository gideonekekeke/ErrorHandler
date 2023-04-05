import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
	new GoogleStrategy(
		{
			clientID:
				"526763411906-p1sbanrkl0adlhtfsafvch1pnucniqp3.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "http://localhost:1400/auth/google/callback",
		},
		(accessToken, refreshToken, profile, cb) => {
			const user = {
				email: profile._json.email,
				name: profile.displayName,
			};
			cb(null, user);
			console.log(user);
		},
	),
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user: any, done) => {
	done(null, user);
});
