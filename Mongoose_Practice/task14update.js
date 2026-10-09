import mongoose from "mongoose";
import { Product } from "./task13update.js";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/practice_db");
  } catch (error) {
    console.log(error);
  }
};

const purchaseProduct = async (productId, quantityRequested) => {
  try {
    const doc = await Product.findById(productId);
    // console.log(doc);
    if (doc.stock < quantityRequested) {
      console.log("Insufficient stock available");
      return;
    }
    const isOutofStock = doc - quantityRequested === 0;

    const updatedDoc = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { stock: -quantityRequested },
        ...(isOutofStock && { $set: { isFeatured: true } }),
      },
      { new: true, runValidators: true },
    ).lean();
  } catch (error) {
    console.log(error);
  }
};

const bulkTagCategory = async (category, newTagsArray) => {
  try {
    const doc = await Product.updateMany(
      { category: category },
      { $addToSet: { tags: { $each: newTagsArray } } },
    );
    console.log(doc.modifiedCount);
  } catch (error) {
    console.log(error);
  }
};

const getLowStockAlerts = async (threshold = 10, page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  try {
    const docs = await Product.find()
      .where("stock")
      .lte(threshold)
      .select("title category stock price")
      .sort({ stock: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    console.log({
      page,
      limit,
      totalAlerts: docs.length,
      data: docs,
    });
  } catch (error) {
    console.log(error);
  }
};

const applyPriceIncrease = async (productId, percentage) => {
  try {
    if (percentage > 50) {
      throw new Error(
        "Price increase exceeds maximum allowed threshold of 50%",
      );
    }
    const doc = await Product.findById(productId);
    const updatedPrice = Number(
      (doc.price * (1 + percentage / 100)).toFixed(2),
    );

    const updatedDoc = await Product.findByIdAndUpdate(
      productId,
      { $set: { price: updatedPrice } },
      { new: true, runValidators: true },
    ).lean();
  } catch (error) {
    console.log(error);
  }
};

const run = async () => {
  try {
    await connectDB();
    await applyPriceIncrease();
  } catch (error) {
    console.log(error);
  }
};

run();
