"use client";
import React, { useEffect } from "react";
import ChatListNavbar from "./ChatListNavbar";
import useSWR from "swr";
import { urls } from "@/lib/constants";
import { fetchWithToken } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedUser, userInfo } from "@/store/atoms/userAtom";
import { lastMessage } from "@/store/atoms/chatAtom";
// import { messagesAtom } from "@/store/atoms/chatAtom";

export default function ChatList({
  user: sessionUser,
}: {
  user: {
    id: string;
    email: string;
    token: string;
  };
}) {
  const { token } = sessionUser;
  const setUser = useSetRecoilState(userInfo);

  async function getUserData() {
    const res = await fetch(`${urls.backendUrl}/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUser(data.user);
  }

  const { isLoading, error, data } = useSWR(
    [`${urls.backendUrl}/api/v1/users/all`, token],
    ([url, token]) => fetchWithToken(url, token)
  );

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <ChatListNavbar />

      {isLoading
        ? Array.from([1, 2, 3, 4, 5]).map((item, index) => {
            return <ChatSkeleton key={index} />;
          })
        : data.users.map((item: any) => (
            <ChatUserComponent key={item.id} item={item} />
          ))}
    </>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex items-center space-x-4 m-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function ChatUserComponent({ item }: any) {
  const setSelectedUser = useSetRecoilState(selectedUser);
  const latestMessage = useRecoilValue(lastMessage);
  // const messages = useRecoilValue(messagesAtom);
  // const lastMessage: string = messages[messages.length - 1]?.Message;
  // console.log(lastMessage);

  return (
    <Link
      href={`/${item.id}`}
      className="flex items-center space-x-4 border-b py-5 border-gray-200 dark:border-gray-800 pl-5 hover:bg-gray-200 dark:hover:bg-gray-800 bg-opacity-50 transition-all duration-300"
      onClick={() => setSelectedUser(item)}
    >
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback className="uppercase">
          {item.firstName.split("")[0]}
          {item.lastName.split("")[0]}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p className="font-bold capitalize">
          {item.firstName} {item.lastName}
        </p>
        <p className="text-sm">{item.email}</p>
      </div>
    </Link>
  );
}
