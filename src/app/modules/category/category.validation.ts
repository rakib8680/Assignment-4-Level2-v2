import { z } from "zod";

export const categoryValidationSchema = z.object({
  name: z.string().max(50, "Category name should not exceed 50 characters"),
});
