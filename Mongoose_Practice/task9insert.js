import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/user");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "name os required"],
  },
  email: {
    type: String,
    required: [true, "email os required"],
    trim: true,
    unique: true,
  },
  username: {
    type: String,
    trim: true,
    required: [true, "username os required"],
  },
  age: {
    type: Number,
    required: [true, "age os required"],
    min: [18, "Minimum Age is 18"],
  },
});

const User = mongoose.model("user", UserSchema);

const registerWithWelcomeTag = async (userData) => {
  const isExists = userData.tags.find((tag) => tag === 'new member')
  if(!isExists){
    userData.tags.push('new member')
  }
  try {
    const sveData = await User.create(userData);
    console.log(sveData);
  } catch (error) {
    if (error.name === "ValidationError") {
      console.log(error.message);
    } else if (error.code === 11000) {
      console.log("duplicate key");
    } else {
      console.log(error);
    }
  }
};

registerWithWelcomeTag({
  name: "Tina",
  email: "tina@test.com",
  username: "tina_v",
  age: 24,
});
