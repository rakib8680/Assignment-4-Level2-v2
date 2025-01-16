import { Schema, model } from "mongoose";
import { TCourse, TTags } from "./course.interface";
import { courseLevel } from "./course.constant";
import { calculateDurationInWeeks } from "../../utils/calculateDurationInWeeks";

const tagsSchema = new Schema<TTags>({
  name: {
    type: String,
    required: [true, "Tag name is required"],
  },
  isDeleted: { type: Boolean, default: false },
  
},{_id:false});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
    required: [true, "Course title is required"],
  },
  instructor: {
    type: String,
    required: [true, "Instructor name is required"],
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: [true, "Please provide a category id"],
  },
  price: {
    type: Number,
    required: [true, "Provide a price for the course"],
  },
  tags: [tagsSchema],
  startDate: {
    type: String,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: String,
    required: [true, "End date is required"],
  },
  language: {
    type: String,
    required: [true, "Course language is required"],
  },
  provider: String,
  durationInWeeks: Number,
  details: {
    level: {
      type: String,
      enum: {
        values: courseLevel,
      },
    },
    description: String,
  },
});

// pre save hook/middleware to calculate the duration in weeks
courseSchema.pre("save", function (next) {
  const course = this;

  const durationInWeeks = calculateDurationInWeeks(
    course.startDate,
    course.endDate
  );

  course.durationInWeeks = durationInWeeks;

  next();
});

// model
export const CourseModel = model<TCourse>("course", courseSchema);
