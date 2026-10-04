import mongoose from "mongoose";

// try {
//   await mongoose.connect(process.env.MONGO_DB_URI);
//   console.log("Db Connected");
// } catch (error) {
//   console.log(error);
// }

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [15, "Username cannot exceed 15 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);