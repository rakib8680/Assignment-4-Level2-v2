import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import { userRoles } from "./user.constant";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: {
        values: userRoles,
        message: `{VALUE} is not a valid role`,
      },
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// hash the password before saving to DB
userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user?.password, Number(config.bcryptSalt));
  next();
});

export const UserModel = model<TUser>("user", userSchema);
