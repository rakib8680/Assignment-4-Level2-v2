import { NextFunction } from "express";
import { AnyZodObject } from "zod";
import catchAsync from "../utils/catchAsync";

const requestValidation = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next: NextFunction) => {
    await schema.parseAsync(req.body);
    next();
  });
};

export default requestValidation;
