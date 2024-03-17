"use client";
import { userInfo } from "@/store/atoms/userAtom";
import React from "react";
import { useRecoilValue } from "recoil";

export default function LandingPage() {
  const user = useRecoilValue(userInfo);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>
        Welcome{" "}
        <span className="font-bold text-xl capitalize">{user.firstName}</span>{" "}
        to Apna Chat App
      </p>
    </div>
  );
}
