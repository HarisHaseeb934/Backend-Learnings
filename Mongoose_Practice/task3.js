import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mongoose_practice");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

const postSchema = mongoose.Schema({
  title: {
    tyepe: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  slug: {
    tyepe: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  content: {
    tyepe: String,
    required: true,
    maxlength: 20,
  },
  view: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  readTimeMinutes: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: function (v) {
        return Number.isInteger(v);
      },
      message: "Read time must be a whole number of minutes",
    },
  },
},{timestamps: true});
