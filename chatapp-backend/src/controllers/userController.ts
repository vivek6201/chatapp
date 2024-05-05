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
    });

    if (!userExists) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "user not found",
      });
    }

    const checkPass = await bcrypt.compare(data.password, userExists.password);

    if (!checkPass) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Password incorrect",
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
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      })
    }

    const jwtToken = jwt.sign(payload, secret);
    return res.status(statusCodes.OK).json({
      success: true,
      message: "user logged in successfully",
      token: jwtToken,
      user: {
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        email: userExists.email,
        id: userExists.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "failed to login user",
    });
  }
};

export const getAllUsersControllers = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.userId;
    const users = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        email: true,
        id: true,
      },
    });

    const filteredUsers = users.filter((item) => item.id !== userId);

    return res.status(statusCodes.OK).json({
      success: true,
      users: filteredUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "failed to fetch users data",
    });
  }
};

export const getUserDataControllers = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.userId as string;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        id: true,
      },
    });

    return res.status(statusCodes.OK).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "failed to fetch users data",
    });
  }
};
