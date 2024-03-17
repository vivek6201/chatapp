import express from "express";
import {
  getMessagesController,
  sendMessageController,
} from "../controllers/chatController";
import { authMiddleware } from "../middleware/authMiddleware";

//router is initialized
const router = express.Router();

//this is used to send message
router.post("/sendMessage", authMiddleware, sendMessageController);
router.get("/getMessages/:from/:to", getMessagesController);

export default router;
