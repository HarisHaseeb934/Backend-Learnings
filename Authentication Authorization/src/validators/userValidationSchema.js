import z from "zod";

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .min(13, { message: "Email must be greater than 3 Charcters" })
    .max(100, { message: "Name must be Lower than 100 Charcters" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be greater than 3 Charcters" })
    .max(100, { message: "Password must be Lower than 100 Charcters" }),
});

export const registerUserSchema = loginUserSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: "Email must be greater than 3 Charcters" })
    .max(100, { message: "Name must be Lower than 100 Charcters" }),
});
