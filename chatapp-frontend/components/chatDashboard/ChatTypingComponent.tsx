"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";
import { urls } from "@/lib/constants";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedUser, userInfo } from "@/store/atoms/userAtom";
import { useSession } from "next-auth/react";
import { useSocket } from "@/Contexts/SocketProvider";
import { messageAtom, messagesAtom, typingAtom } from "@/store/atoms/chatAtom";

export default function ChatTypingComponent() {
  const { data: sesssion }: any = useSession();
  const [message, setMessage] = useRecoilState(messageAtom);
  const setMessages = useSetRecoilState(messagesAtom);
  const sender = useRecoilValue(userInfo);
  const reciever = useRecoilValue(selectedUser);
  const { socket } = useSocket();
  const [typing, setTyping] = useRecoilState(typingAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (socket) {
      socket.emit("typing", {
        from: sender.id,
        to: reciever.id,
      });
      setTyping((prev) => {
        return {
          ...prev,
          status: true,
        };
      });

      let lastTypingTime = new Date().getTime();
      let timerLength = 3000;

      setTimeout(() => {
        let currTime = new Date().getTime();
        let timeDiff = currTime - lastTypingTime;

        if (timeDiff >= timerLength && typing.status) {
          socket.emit("stop-typing", {
            from: sender.id,
            to: reciever.id,
          });
          setTyping((prev) => {
            return {
              ...prev,
              status: false,
            };
          });
        }
      }, timerLength);
    }
    setMessage(e.target.value);
  };

  const sendMessageHandler = async () => {
    try {
      const { data } = await axios.post(
        `${urls.backendUrl}/api/v1/chat/sendMessage`,
        {
          from: sender.id,
          to: reciever.id,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${sesssion?.user.token}`,
          },
        }
      );
      if (socket) {
        setMessages((prev: any) => [...prev, data.message]);
        socket.emit("send-msg", {
          to: reciever.id,
          from: sender.id,
          message: data.message,
        });
        socket.emit("stop-typing", {
          from: sender.id,
          to: reciever.id,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMessage("");
    }
  };

  return (
    <footer className="border-t dark:border-zinc-700 p-4">
      <div className="flex items-center gap-2">
        <Input
          className="flex-1"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => handleChange(e)}
        />
        <Button disabled={message === ""} onClick={sendMessageHandler}>
          Send
        </Button>
      </div>
    </footer>
  );
}
