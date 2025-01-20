import { z } from "zod";
import { userRoles } from "./user.constant";

const createUserValidationSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(4, { message: "Password must be at least 4 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
    }),
  role: z.enum(userRoles as [string, ...string[]]).optional(),
});


const loginUserValidationSchema = z.object({
  username : z.string({ message: "Please provide a valid username" }),
  password : z.string({ message: "Please provide a valid password" })
})



export const userValidations = {
  createUserValidationSchema,
  loginUserValidationSchema
};
