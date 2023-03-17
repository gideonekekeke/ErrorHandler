import { getUser, createUser } from "../Controller/UserController";
import express from "express";
const router = express.Router();

router.post("/createuser", createUser);
router.get("/getAll", getUser);

export default router;
