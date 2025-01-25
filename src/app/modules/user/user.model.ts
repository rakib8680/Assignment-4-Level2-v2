import { Schema, model } from "mongoose";
import { StaticUserModel, TUser } from "./user.interface";
import { userRoles } from "./user.constant";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, StaticUserModel>(
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
    },
    passwordChangedAt: {
      type: Date,
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
    versionKey: false,
  }
);

// hash the password before saving to DB
userSchema.pre("save", async function (next) {
  const user = this;
  if (user?.password) {
    user.password = await bcrypt.hash(
      user?.password as string,
      Number(config.bcryptSalt)
    );
  }
  next();
});

// static method to check if user exist
userSchema.statics.isUserExist = async function (username: string) {
  return await this.findOne({ username });
};

// static method to check if password matched
userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const UserModel = model<TUser, StaticUserModel>("user", userSchema);
