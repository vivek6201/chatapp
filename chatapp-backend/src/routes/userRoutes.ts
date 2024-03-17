import express from "express";
import {
  createUserController,
  getAllUsersControllers,
  getUserDataControllers,
  loginUserController,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

//router is initialized
const router = express.Router();

//this is used to create and login user
router.post("/create", createUserController);
router.post("/login", loginUserController);
router.get("/all", authMiddleware, getAllUsersControllers);
router.get("/", authMiddleware, getUserDataControllers);

export default router;
