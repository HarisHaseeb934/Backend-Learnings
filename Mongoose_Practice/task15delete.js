import mongoose from "mongoose";
import { Product } from "./task13update.js";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/practice_db");
  } catch (error) {
    console.log(error);
  }
};

const deleteProductById = async (productId) => {
  try {
    const deletedDoc = await Product.findByIdAndDelete(productId);
    if (deletedDoc) {
      console.log(`Successfully deleted ${deletedDoc.title}`);
    } else {
      console.log(`Product not found`);
    }
  } catch (error) {
    console.log(error);
  }
};

const clearCategory = async (categoryName) => {
  try {
    const deletedDoc = await Product.deleteMany({ category: categoryName });
    console.log(deletedDoc.deletedCount);
  } catch (error) {
    console.log(error);
  }
};

const purgeDiscontinued = async (maxPrice) => {
  try {
    const deletedDoc = await Product.deleteMany({ stock: 0 }).where('price').lt(maxPrice);
    console.log(deletedDoc.deletedCount);
  } catch (error) {
    console.log(error);
  }
};

const run = async () => {
  try {
    await connectDB();
    await deleteProductById('6ac7b90f37f993c472470492');
    await clearCategory('Electronics');
    await purgeDiscontinued(200);
  } catch (error) {
    console.log(error);
  }
};

run();
