import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";

const GOOGLE_SECRET = "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";

const GOOGLE_ID =
	"526763411906-dab729ct9f2tsuqpmb6uv30t7kp9a584.apps.googleusercontent.com";

const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground";

const GOOGLE_REFRESHTOKEN =
	"1//04Y5AsDKQNfTvCgYIARAAGAQSNwF-L9IrlXB3BZV31aPR2nzemx4DkcLXimEb9aD4eIngPXPQ_gW2-Rt8N3LdFNGA-gkmDKTc0Sc";

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

const url = "http://localhost:1400";
const frontEndUrl = "http://localhost:3000";

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESHTOKEN });

export const AccountVerification = async (
	token: any,
	email: any,
	name: any,
) => {
	try {
		const accessToken = await oAuth.getAccessToken();

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "shotkode123@gmail.com",
				refreshToken: GOOGLE_REFRESHTOKEN,
				clientId: GOOGLE_ID,
				clientSecret: GOOGLE_SECRET,
				accessToken: accessToken,
			},
		});

		const buildFile = path.join(__dirname, "../views/AccountVerification.ejs");

		const data = await ejs.renderFile(buildFile, {
			token: token,
			name: name,
			url: url,
		});

		const mailOptions = {
			from: "Annonymous<shotkode123@gmail.com>",
			to: email,
			subject: "Account Verification",
			html: data,
		};

		transporter.sendMail(mailOptions);
	} catch (err) {
		return err;
	}
};

export const ForgotPasswordVerification = async (
	token: any,
	email: any,
	name: any,
) => {
	try {
		const accessToken = await oAuth.getAccessToken();

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "shotkode123@gmail.com",
				refreshToken: GOOGLE_REFRESHTOKEN,
				clientId: GOOGLE_ID,
				clientSecret: GOOGLE_SECRET,
				accessToken: accessToken,
			},
		});

		const buildFile = path.join(__dirname, "../views/forgotPassword.ejs");

		const data = await ejs.renderFile(buildFile, {
			token: token,
			name: name,
			frontEndUrl: frontEndUrl,
		});

		const mailOptions = {
			from: "Annonymous<shotkode123@gmail.com>",
			to: email,
			subject: "forgotPassword Verification",
			html: data,
		};

		transporter.sendMail(mailOptions);
	} catch (err) {
		return err;
	}
};
