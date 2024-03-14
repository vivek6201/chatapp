import express from "express";
import {
  createUserController,
  loginUserController,
} from "../controllers/userController";

//router is initialized
const router = express.Router();

//this is used to create and login user
router.post("/create", createUserController);
router.post("/login", loginUserController);

export default router;
