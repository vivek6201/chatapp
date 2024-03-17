"use client";
import ChatNavbar from "@/components/chatDashboard/ChatNavbar";
import ChatTypingComponent from "@/components/chatDashboard/ChatTypingComponent";
import DisplayMessagesComponent from "@/components/chatDashboard/DisplayMessagesComponent";
import { selectedUser } from "@/store/atoms/userAtom";
import { useRouter } from "next/navigation";
import React from "react";
import { useRecoilValue } from "recoil";

export default function ChatComponent() {
  // const router = useRouter();
  // const currentUser = useRecoilValue(selectedUser);

  // if (currentUser.id === "") {
  //   router.push("/");
  // }

  return (
    <div className="grid grid-rows-[70px_1fr_70px]">
      <ChatNavbar />
      <DisplayMessagesComponent />
      <ChatTypingComponent />
    </div>
  );
}
