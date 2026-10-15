import mongoose from "mongoose";
import argon2 from "argon2";

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
      required: true,
      trim: true,
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

export const User = mongoose.model("user", userSchema);
