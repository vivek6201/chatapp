import express, { Router } from "express";
import chatRoutes from "./chatRoutes";
import userRoutes from "./userRoutes";

const router = express.Router();

//mounting the paths to respective end points
router.use("/user", userRoutes);
router.use("/chat", chatRoutes);

export default router;
