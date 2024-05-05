import Signup from "@/components/auth/SignupComponent";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {

  const session  = await getServerSession(authOptions);

  if(session) redirect("/");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Signup />
    </div>
  );
}
