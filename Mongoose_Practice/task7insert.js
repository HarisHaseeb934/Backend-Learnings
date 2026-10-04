import mongoose from "mongoose";
import { User } from "./task1.js";

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mongoose_practice');
  } catch (error) {
    console.log(error.message);
  }
};

connectDB();

async function seedUsers() {
  try {
    const save = await User.create([
      { name: "John", email: "john@test.com", password: '11111111111', username: "john_d", age: 22, tage: ['hy, hello'] },
      { name: "Sarah", email: "sarah@test.com", password: '11111111111', username: "sarah_m", age: 29, tage: ['hy, hello'] },
      { name: "Mike", email: "mike@test.com", password: '11111111111', username: "mike_k", age: 35, tage: ['hy, hello'] },
    ]);
  } catch (error) {
    if(error.name === 'ValidationError'){
      console.log("Invalid user data: " + error.message)
    }
    if(error.code === 11000){
      console.log("Duplicate entry: Email or username already exists!")
    }
  }
}

seedUsers()
