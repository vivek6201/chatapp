"use client";
import ChatNavbar from "@/components/chatDashboard/ChatNavbar";
import ChatTypingComponent from "@/components/chatDashboard/ChatTypingComponent";
import DisplayMessagesComponent from "@/components/chatDashboard/DisplayMessagesComponent";
import { selectedUser } from "@/store/atoms/userAtom";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { useRecoilValue } from "recoil";

export default function ChatComponent() {
  const currentUser = useRecoilValue(selectedUser);

  if (currentUser.id === "") {
    redirect("/");
  }

  return (
    <div className="grid grid-rows-[70px_1fr_70px]">
      <ChatNavbar />
      <DisplayMessagesComponent />
      <ChatTypingComponent />
    </div>
  );
}
