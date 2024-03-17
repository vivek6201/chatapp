import { Request, Response } from "express";
import { statusCodes } from "../utils/statusCodes";
import prisma from "../db";

export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const { message, from, to } = req.body;
    if (!message || !from || !to) {
      return res.status(statusCodes.FORBIDDEN).json({
        success: false,
        message: "Message, from and to is required",
      });
    }

    const newMessage = await prisma.messages.create({
      data: {
        Message: message,
        sender: { connect: { id: from } },
        reciever: { connect: { id: to } },
      },
      include: {
        reciever: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            id: true,
          },
        },
        sender: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            id: true,
          },
        },
      },
    });

    return res.status(statusCodes.CREATED).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "failed to create message entry",
    });
  }
};

export const getMessagesController = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.params;

    if (!from || !to) {
      return res.status(statusCodes.FORBIDDEN).json({
        success: false,
        message: "from and to is required",
      });
    }

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: from,
            recieverId: to,
          },
          {
            senderId: to,
            recieverId: from,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return res.status(statusCodes.OK).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};
