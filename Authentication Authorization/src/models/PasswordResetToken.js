import mongoose from "mongoose";

const passwordRestTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      length: 8,
    },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      expires: 0,
    },
  },
  { timestamps: true },
);

export const PasswordResetToken = mongoose.model(
  "passwordResetToken",
  passwordRestTokenSchema,
);
