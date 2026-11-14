import mongoose from "mongoose";
import argon2 from "argon2";
import { Session } from "./Session.js";
import { EmailVerificationToken } from "./EmailVerificationToken.js";
import { PasswordResetToken } from "./PasswordResetToken.js";
import { Oauth } from "./OAuth.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon2.hash(this.password);
});

userSchema.methods.comparePassword = async function (password) {
  return await argon2.verify(this.password, password);
};

userSchema.pre("findOneAndDelete", async function () {
  const { _id: id } = this.getQuery();
  if (id) {
    await Session.deleteMany({ user: id });
    await EmailVerificationToken.deleteMany({ user: id });
    await PasswordResetToken.deleteMany({ user: id });
    await Oauth.deleteMany({user: id});
  }
});

export const User = mongoose.model("user", userSchema);
