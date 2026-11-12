import z from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(3, { message: "Minimun Length is 3 Characters" })
  .max(100, { message: "Maximum Length is 100 Characters" });

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
    .min(3, { message: "Password must be greater than 3 Charcters" })
    .max(100, { message: "Password must be Lower than 100 Charcters" }),
});

export const registerUserSchema = loginUserSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: "Email must be greater than 3 Charcters" })
    .max(100, { message: "Name must be Lower than 100 Charcters" }),
});

export const verifyEmail = z.object({
  token: z.string().trim().length(8),
  email: z.string().trim().email(),
});

export const editProfileSchema = z.object({
  name: nameSchema,
});

export const verifyPasswords = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(3, { message: "Current Password must be greater than 3 Charcters" })
      .max(100, {
        message: "Current Password must be Lower than 100 Charcters",
      }),
    newPassword: z
      .string()
      .trim()
      .min(3, { message: "New Password must be greater than 3 Charcters" })
      .max(100, { message: "New Password must be Lower than 100 Charcters" }),
    confirmPassword: z
      .string()
      .trim()
      .min(3, { message: "Confirm Password must be greater than 3 Charcters" })
      .max(100, {
        message: "Confirm Password must be Lower than 100 Charcters",
      }),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    error: "Confirm Password and New Password Must Match",
    path: ["confirmPassword"],
  });

export const emailSchema = z.object({
  registerEmail: z
    .string()
    .trim()
    .check(z.email())
});
