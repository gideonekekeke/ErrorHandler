import mongoose from "mongoose";

interface IData {
	name: string;
	email: string;
}

interface mainData extends IData, mongoose.Document {
	resetPasswordLink: string;
}

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

		email: {
			type: String,
			required: true,
		},

		password: {
			type: String,
			required: true,
			trim: true,
		},

		resetPasswordLink: {
			type: String,
		},
	},
	{ timestamps: true },
);

export default mongoose.model<mainData>("users", userSchema);
