"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedUser } from "@/store/atoms/userAtom";
import { useSocket } from "@/Contexts/SocketProvider";
import { typingAtom } from "@/store/atoms/chatAtom";

export default function ChatNavbar() {
  const user = useRecoilValue(selectedUser);
  const [typing, setTyping] = useRecoilState(typingAtom);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("display-typing", (data: any) => {
        setTyping({
          from: data.from,
          to: data.to,
          status: true,
        });
      });
      socket.on("stop-display-typing", (data) => {
        console.log("inside stop display");
        setTyping({
          from: data.from,
          to: data.to,
          status: false,
        });
      });
    }
  }, [socket]);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback className="uppercase">
            {user.firstName.split("")[0]}
            {user.lastName.split("")[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center space-x-2">
          <div className="space-y-1.5">
            <div className="font-semibold capitalize">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {typing.from === user.id && typing.status
                ? "Typing..."
                : "Online"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
