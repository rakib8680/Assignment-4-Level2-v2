import { z } from "zod";
import { courseLevel } from "./course.constant";

const tagsSchemaValidation = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});

const detailsSchemaValidation = z.object({
  level: z.enum(courseLevel as [string, ...string[]]),
  description: z.string(),
});

const createCourseSchemaValidation = z.object({
  title: z
    .string()
    .min(5, { message: "Course title must be at least 5 characters long" })
    .max(100, { message: "Title Cannot be more than 100 characters long" }),
  instructor: z.string(),
  categoryId: z.string(),
  price: z.number().min(0, { message: "Price cannot be negative" }),
  tags: z.array(tagsSchemaValidation).optional(),
  startDate: z.string(),
  endDate: z.string(),
  language: z.string(),
  provider: z.string().optional(),
  durationInWeeks: z.number().optional(),
  details: detailsSchemaValidation,
});

const updateCourseSchemaValidation = createCourseSchemaValidation
  .partial()
  .extend({
    details: detailsSchemaValidation.partial(),
  });

export const courseValidations = {
  createCourseSchemaValidation,
  updateCourseSchemaValidation,
};
