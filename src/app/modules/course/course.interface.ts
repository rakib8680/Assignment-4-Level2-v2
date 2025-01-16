import { Types } from "mongoose";

export type TTags = {
  name: string;
  isDeleted: boolean;
};

export type TLevel = "Beginner" | "Intermediate" | "Advanced";

export type TCourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: TTags[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks: number;
  details: {
    level: TLevel;
    description: string;
  };
};
