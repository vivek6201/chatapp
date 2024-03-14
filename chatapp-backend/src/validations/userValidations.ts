import z from "zod";

export const createUserValidations = z
  .object({
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(16),
    confirmPassword: z.string().min(8).max(16),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export const loginUserValidations = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

export type CreateUserType = z.infer<typeof createUserValidations>;
export type LoginUserType = z.infer<typeof loginUserValidations>;
