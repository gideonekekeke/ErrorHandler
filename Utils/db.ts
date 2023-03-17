import mongoose from "mongoose";
import dot from "dotenv";
dot.config();
const online_url: any = process.env.ONLINE_URL;

mongoose
	.connect(online_url)
	.then(() => {
		console.log(`connected successfully`);
	})
	.catch((err) => {
		console.log(err);
	});
