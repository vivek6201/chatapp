"use client";
import { userInfo } from "@/store/atoms/userAtom";
import React from "react";
import { useRecoilValue } from "recoil";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import ChatList from "./ChatList";

export default function LandingPage({ data }: any) {
  const user = useRecoilValue(userInfo);

  return (
    <div className="grid grid-rows-[70px_1fr] md:grid-rows-1 place-items-center h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 md:hidden w-full">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger>
              <Menu className="block md:hidden" />
            </SheetTrigger>
            <SheetContent side={"left"}>
              <ChatList user={data} />
            </SheetContent>
          </Sheet>
          <p className="font-bold uppercase text-center">APNA CHAT</p>
        </div>
      </div>
      <p>Welcome <span className="font-bold text-xl capitalize">{user.firstName}</span> to Apna chat app</p>
    </div>
  );
}
