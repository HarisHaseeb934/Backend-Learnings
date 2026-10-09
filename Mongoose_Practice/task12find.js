import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/practice_db");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
    },
    items: [
      {
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const dummyOrders = [
  {
    orderNumber: "ORD-1001",
    customer: { name: "Alice Smith", email: "alice@example.com" },
    items: [
      { productName: "Wireless Mouse", quantity: 2, price: 25 },
      { productName: "Mechanical Keyboard", quantity: 1, price: 100 },
    ],
    totalAmount: 150,
    status: "delivered",
    isPaid: true,
    placedAt: new Date("2026-09-01T10:00:00Z"),
  },
  {
    orderNumber: "ORD-1002",
    customer: { name: "Bob Jones", email: "bob@example.com" },
    items: [{ productName: "USB-C Cable", quantity: 3, price: 10 }],
    totalAmount: 30,
    status: "pending",
    isPaid: false,
    placedAt: new Date("2026-10-01T14:30:00Z"),
  },
  {
    orderNumber: "ORD-1003",
    customer: { name: "Alice Smith", email: "alice@example.com" },
    items: [{ productName: "27-inch Monitor", quantity: 1, price: 300 }],
    totalAmount: 300,
    status: "shipped",
    isPaid: true,
    placedAt: new Date("2026-10-02T09:15:00Z"),
  },
  {
    orderNumber: "ORD-1004",
    customer: { name: "Charlie Brown", email: "charlie@example.com" },
    items: [
      { productName: "Gaming Headset", quantity: 1, price: 80 },
      { productName: "Mouse Pad", quantity: 2, price: 15 },
    ],
    totalAmount: 110,
    status: "delivered",
    isPaid: true,
    placedAt: new Date("2026-09-15T11:20:00Z"),
  },
  {
    orderNumber: "ORD-1005",
    customer: { name: "Diana Prince", email: "diana@example.com" },
    items: [{ productName: "Ergonomic Chair", quantity: 1, price: 250 }],
    totalAmount: 250,
    status: "cancelled",
    isPaid: false,
    placedAt: new Date("2026-09-20T16:45:00Z"),
  },
  {
    orderNumber: "ORD-1006",
    customer: { name: "Evan Wright", email: "evan@example.com" },
    items: [{ productName: "Mechanical Keyboard", quantity: 2, price: 100 }],
    totalAmount: 200,
    status: "processing",
    isPaid: true,
    placedAt: new Date("2026-10-05T08:00:00Z"),
  },
];

const Order = mongoose.model("order", orderSchema);

const dummyData = async () => {
  try {
    const docs = await Order.create(dummyOrders);
    console.log(docs);
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicater Entry");
    } else if (error.message === "ValidationError") {
      console.log("Validation Error");
    } else {
      console.log(error);
    }
  }
};

// dummyData();

const getOrdersByCustomerEmail = async (email) => {
  try {
    const docs = await Order.find({ "customer.email": email })
      .select("orderNumber totalAmount status placedAt")
      .lean();
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};

// getOrdersByCustomerEmail('diana@example.com')

const getHighValuePaidOrders = async (minAmount) => {
  try {
    const docs = await Order.find({ isPaid: true })
      .where("totalAmount")
      .gte(minAmount)
      .sort({ totalAmount: -1 })
      .lean();
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};

// getHighValuePaidOrders(10)

const getOrdersContainingProduct = async (productName) => {
  try {
    const docs = await Order.find({ "items.productName": productName }).lean();
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};
// getOrdersContainingProduct('Mechanical Keyboard')

const getOrdersInDateRange = async (startDate, endDate) => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
  try {
    const docs = await Order.find().where('placedAt').gte(new Date(startDate)).lte(new Date(endDate)).sort({placedAt: -1}).lean();
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};

// getOrdersInDateRange();


const getPendingOrProcessingOrders = async() => {
    try {
    const docs = await Order.find().where('status').in(['pending', 'processing']).select('-items._id -__v');
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
}

getPendingOrProcessingOrders()
