import mongoose from "mongoose";
import { Order } from "./Aggregate.js";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/practice");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const aggregate = async () => {
  try {
    const docs = await Order.aggregate([
      {
        $match: {
          status: { $in: ["completed", "pending", "cancelled", "shipped"] },
        },
      },
      {
        $group: {
          _id: "$customerName",
          cardOrders: {
            $sum: {
              $cond: [{ $eq: ["$paymentMethod", "card"] }, 1, 0],
            },
          },
          cashOrders: {
            $sum: {
              $cond: [{ $eq: ["$paymentMethod", "cash"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
            customerName: "$_id",
            cardOrders: 1,
            cashOrders: 1,
            totalOrders: 1
        }
      },
    ]);
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};

aggregate();
