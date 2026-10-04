import mongoose from "mongoose";
import { User } from "./task1.js";

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mongoose_practice");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

connectDB();

async function createUserWithRole(userData, isAdminCodeValid) {
  try {
    const user = new User(userData);
    if (isAdminCodeValid) {
      user.role = "admin";
    } else {
      user.role = "user";
    }

    const save = await user.save();
    console.log("saved");
  } catch (error) {
    console.log(error.message);
  }
}

createUserWithRole({name: 'haris', email: 'hari@mail.com', password: '11111111111111', age: 22, username: 'hhh', tage: ['hy, hello']}, true)
