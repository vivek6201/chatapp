import LoginComponent from "@/components/auth/LoginComponent";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {

  const session  = await getServerSession(authOptions);

  if(session) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginComponent />
    </div>
  );
}
