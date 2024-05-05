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
import { urls } from "@/lib/constants";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupComponent() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserForm>();

  const router = useRouter();

  const onSubmit: SubmitHandler<UserForm> = async (values) => {
    try {
      const res = await fetch(`${urls.backendUrl}/api/v1/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/login");
        toast.success("User signup successfully", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("User signup successfully", {
        position: "bottom-right",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-2">
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="name">First Name</Label>
              <Input
                id="firstName"
                placeholder="enter first name"
                {...register("firstName", { required: true })}
              />
              {errors.firstName && (
                <span className="text-red-400 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Last Name</Label>
              <Input
                id="lastName"
                placeholder="enter last name"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <span className="text-red-400 text-xs">
                  This field is required
                </span>
              )}
            </div>
          </div>
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
          <div className="space-y-2 mb-5">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <span className="text-red-400 text-xs">
                This field is required
              </span>
            )}
          </div>
          <Button className="w-full" type="submit">
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center">
          Already have an account{" "}
          <Link href={"/login"} className="text-blue-500 hover:underline">
            login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
