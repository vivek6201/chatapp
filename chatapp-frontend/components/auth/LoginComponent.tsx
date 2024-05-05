"use client";
import React from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

interface UserForm {
  email: string;
  password: string;
}

export default function LoginComponent() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserForm>();

  const router = useRouter();

  const onSubmit: SubmitHandler<UserForm> = async (values) => {
    const { email, password } = values;
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
      toast.success("User logged in successfully", {
        position: "bottom-right",
      });
    } else {
      toast.error("error while logging in", {
        position: "bottom-right",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-2">
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your information to login into your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-400 text-xs">
                This field is required
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-400 text-xs">
                This field is required
              </span>
            )}
          </div>
          <Button className="w-full mt-3" type="submit">
            Sign in
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center">
          Create a new Account <Link href={"/signup"} className="text-blue-500 hover:underline">here</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
