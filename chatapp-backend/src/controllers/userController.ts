import { Request, Response } from "express";
import {
  CreateUserType,
  LoginUserType,
  createUserValidations,
  loginUserValidations,
} from "../validations/userValidations";
import { statusCodes } from "../utils/statusCodes";
import prisma from "../db";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

//controller for signinup the user
export const createUserController = async (req: Request, res: Response) => {
  const validatedBody = createUserValidations.safeParse(req.body);

  if (!validatedBody.success) {
    return res.status(statusCodes.FORBIDDEN).json({
      success: false,
      error: validatedBody.error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
  }

  const data: CreateUserType = validatedBody.data;

  const hashedPass = await bcrypt.hash(data.password, 10);

  //creating new user
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPass,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        id: true,
      },
    });

    return res.status(statusCodes.CREATED).json({
      success: true,
      message: "user created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "failed to create user",
    });
  }
};

//controller to login user and generating jwt token
export const loginUserController = async (req: Request, res: Response) => {
  const validatedBody = loginUserValidations.safeParse(req.body);

  if (!validatedBody.success) {
    return res.status(statusCodes.FORBIDDEN).json({
      success: false,
      error: validatedBody.error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
  }

  const data: LoginUserType = validatedBody.data;

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        id: true,
      },
    });

    if (!userExists) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "user not found",
      });
    }

    const payload = {
      id: userExists.id,
      email: userExists.email,
    };

    // grabbing jwtSecret from env var.
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.log("secret not found");
      return;
    }

    const jwtToken = jwt.sign(payload, secret);
    return res.status(statusCodes.OK).json({
      success: true,
      message: "user logged in successfully",
      token: jwtToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "failed to login user",
    });
  }
};
