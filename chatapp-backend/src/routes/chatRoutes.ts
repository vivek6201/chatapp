import express from "express";
import { sendMessageController } from "../controllers/chatController";

//router is initialized
const router = express.Router();

//this is used to send message
router.post("/sendMessage", sendMessageController);

export default router;
