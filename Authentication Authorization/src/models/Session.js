import mongoose from "mongoose";

const sessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true },
);

sessionSchema.index(
  { createdAt: 1 },
  { expiresAfterSeconds: 30 * 24 * 60 * 60 },
);

export const Session = mongoose.model("session", sessionSchema);
