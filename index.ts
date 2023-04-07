import express, { Application } from "express";
import { MainApp } from "./MainApp";
const port = 1400;
import "./Utils/db";

const app: Application = express();

const server = app.listen(port, () => {
	console.log("listening on port " + port);
});

MainApp(app);

process.on("uncaughtException", () => {
	console.log("uncaught exception so the server has to shut down");

	process.exit(1);
});

process.on("unhandledRejection", (res: any) => {
	console.log(res);

	server.close(() => {
		process.exit(1);
	});
});
