import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/practice_db");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      min: 0,
    },
    tags: {
      type: [String],
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Product = mongoose.model("product", productSchema);

const dummyProducts = [
  {
    title: "Ergonomic Desk Chair",
    category: "Furniture",
    price: 299.99,
    stock: 15,
    tags: ["office", "furniture", "ergonomic"],
    isFeatured: false,
  },
  {
    title: "Mechanical RGB Keyboard",
    category: "Electronics",
    price: 119.99,
    stock: 45,
    tags: ["gaming", "accessories", "peripherals"],
    isFeatured: true,
  },
  {
    title: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 199.99,
    stock: 8,
    tags: ["audio", "wireless", "peripherals"],
    isFeatured: false,
  },
];

const seedData = async () => {
  try {
    await Product.create(dummyProducts);
  } catch (error) {
    console.log(error);
  }
};

// seedData()

const updateProductPriceAndStock = async (productId, newPrice, stockChange) => {
  try {
    const docs = await Product.findByIdAndUpdate(
      productId,
      { $set: { price: newPrice }, $inc: { stock: stockChange } },
      { returnDocument: "after", runValidators: true },
    );
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};

// updateProductPriceAndStock("6ac7b90f37f993c472470492", 100, 10)

const addTagToProduct = async (productId, tag) => {
  try {
    const docs = await Product.findByIdAndUpdate(
      productId,
      { $addToSet: { tags: tag } },
      { returnDocument: "after", runValidators: true },
    ).lean();
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};

// addTagToProduct('6ac7b90f37f993c472470494', 'keyboard');

const removeTagFromProduct = async (productId, tag) => {
  try {
    const docs = await Product.findByIdAndUpdate(
      productId,
      { $pull: { tags: tag } },
      { returnDocument: "after", runValidators: true },
    ).lean();
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};

// removeTagFromProduct('6ac7b90f37f993c472470493', 'gaming')

const markCategoryAsFeatured = async (category) => {
  try {
    const docs = await Product.updateMany(
      { category: category },
      { $set: { isFeatured: true } },
    ).lean();

    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};
markCategoryAsFeatured('markCategoryAsFeatured')