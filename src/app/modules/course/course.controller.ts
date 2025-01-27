import { CourseServices } from "./course.service";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";

// create a course
const createCourse = catchAsync(async (req, res) => {
  const courseData = req.body;
  const result = await CourseServices.createCourse(courseData, req.user);

  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Course created successfully",
    data: result,
  });
});

// get all courses
const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCourses(req.query);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Courses fetched successfully",
    meta: result.meta,
    data: {
      courses: result.result,
    },
  });
});

// update course
const updateCourse = catchAsync(async (req, res) => {
  const courseId = req.params.id;
  const updatableData = req.body;
  const result = await CourseServices.updateCourse(courseId, updatableData);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Course updated successfully",
    data: result,
  });
});

// get single course with reviews
const getCourseWithReviews = catchAsync(async (req, res) => {
  const courseId = req.params.id;
  const result = await CourseServices.getCourseWithReviews(courseId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Course fetched successfully",
    data: result,
  });
});

// get the best course based on average rating
const getBestCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getBestCourse();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Best course fetched successfully",
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  updateCourse,
  getCourseWithReviews,
  getBestCourse,
};
