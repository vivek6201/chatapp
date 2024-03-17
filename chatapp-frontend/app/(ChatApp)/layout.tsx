import SocketProvider from "@/Contexts/SocketProvider";
import ChatList from "@/components/chatDashboard/ChatList";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data: {
    expires: string | undefined;
    user: {
      id: string;
      email: string;
      token: string;
    };
  } | null = await getServerSession(authOptions);

  if (!data?.user) {
    redirect("/login");
  }

  return (
    <SocketProvider>
      <div className="grid grid-cols-1 md:grid-cols-[25%_1fr] min-h-screen">
        <div className="border-r border-gray-200 dark:border-gray-800 w-full hidden md:block">
          <ChatList user={data.user} />
        </div>
        {children}
      </div>
    </SocketProvider>
  );
}
