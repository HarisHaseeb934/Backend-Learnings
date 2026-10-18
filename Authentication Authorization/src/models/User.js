import mongoose from "mongoose";
import argon2 from "argon2";
import { Session } from "./Session.js";

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

userSchema.pre('findOneAndDelete', async function(next){
  const {_id: id} = this.getQuery()
  if(id){
    await Session.deleteMant({user: id})
  }
})

export const User = mongoose.model("user", userSchema);
