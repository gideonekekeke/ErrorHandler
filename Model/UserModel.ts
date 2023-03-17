import mongoose from "mongoose";

interface IData {
	name: string;
	email: string;
}

interface mainData extends IData, mongoose.Document {}

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
	},
	{ timestamps: true },
);

export default mongoose.model<mainData>("users", userSchema);
