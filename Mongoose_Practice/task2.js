import mongoose from "mongoose";

async function connectDb() {
  try {
    await mongoose.connect("mongodb://localhost:27017/userSystemDB");
    console.log("Db is Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

connectDb();

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      requiredL: true,
      trim: true,
      minLength: 3,
      maxLength: 15,
    },
    email: {
      type: String,
      requiredL: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      requiredL: true,
      minlength: 8,
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
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
