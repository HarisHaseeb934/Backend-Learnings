import mongoose from "mongoose";
import { User } from "./task1.js";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/user");
  } catch (error) {
    console.log(error);
  }
};

// connectDB();

const validUsers = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "Password123!",
    role: "user",
    isVerified: true,
  },
  {
    username: "admin_alex",
    email: "alex.admin@domain.co",
    password: "supersecretpass",
    role: "admin",
  },
  {
    username: "mod_sam",
    email: "alex.admin@domain.co",
    password: "securepassword8",
    role: "moderator",
    isVerified: false,
  },
];

const bulkImportUsers = async (usersList) => {
  const successfulInserts = [];
  const failedInserts = [];
  for (let user of usersList) {
    try {
      const saveUser = await new User(user).save();
      successfulInserts.push(saveUser);
    } catch (error) {
      failedInserts.push({ email: user.email, reason: error.message });
    }
  }
  console.log({
    total: usersList.length,
    inserted: successfulInserts.length,
    failed: failedInserts.length,
    errors: failedInserts,
  });
};

// bulkImportUsers(validUsers);


const run = async () => {
  await connectDB();
  const summary = await bulkImportUsers(validUsers);
  console.log("Import Summary:", summary);
  await mongoose.connection.close(); // Clean up connection when done
};

run();