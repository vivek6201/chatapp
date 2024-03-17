"use client";
import { messagesAtom } from "@/store/atoms/chatAtom";
import React, { useCallback, useEffect } from "react";
import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { Skeleton } from "../ui/skeleton";
import { userInfo as userInfoAtom } from "@/store/atoms/userAtom";
import { useSocket } from "@/Contexts/SocketProvider";

export default function DisplayMessagesComponent() {
  const [{ state, contents }, setMessageState] =
    useRecoilStateLoadable(messagesAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const { socket } = useSocket();

  const addMessage = useCallback((data: { from: string; message: any }) => {
    setMessageState((prev: any) => prev.push(data.message));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("msg-rec", addMessage);
    }
  }, [socket]);

  return (
    <div className="flex-1 p-5 overflow-y-auto max-h-[calc(100vh - 140px)] ">
      {state === "loading" ? (
        Array.from([1, 1, 1, 1, 1, 1, 1]).map((item, index) => (
          <ChatSkeleton key={index} />
        ))
      ) : (
        <div className="flex flex-col gap-y-2 w-full overflow-y-auto">
          {contents.map((item: any) => (
            <div
              className={`${
                item.senderId === userInfo.id ? "self-end" : "self-start"
              } rounded-md px-4 py-2 bg-gray-200 dark:bg-gray-800 w-fit`}
              key={item.id}
            >
              <p>{item.Message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="w-full flex flex-col gap-y-3 flex-1 mb-3">
      <Skeleton className="h-8 w-[250px] rounded-md items-start" />
      <Skeleton className="h-8 w-[250px] rounded-md items-end" />
    </div>
  );
}
