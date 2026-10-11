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
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  username: { type: String, required: true },
  age: {
    type: Number,
    min: 18,
    max: 65,
  },
  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  tags: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model("user", UserSchema);

const dummyUsers = [
  {
    name: "Alice Smith",
    email: "alice@example.com",
    username: "alices",
    age: 25,
    role: "admin",
    isActive: true,
    tags: ["nodejs", "mongodb"],
  },
  {
    name: "Bob Jones",
    email: "bob@example.com",
    username: "bobj",
    age: 19,
    role: "user",
    isActive: true,
    tags: ["react", "frontend"],
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    username: "charlieb",
    age: 42,
    role: "user",
    isActive: false,
    tags: ["python", "data"],
  },
  {
    name: "Diana Prince",
    email: "diana@example.com",
    username: "dianap",
    age: 31,
    role: "moderator",
    isActive: true,
    tags: ["security", "nodejs"],
  },
  {
    name: "Evan Wright",
    email: "evan@example.com",
    username: "evanw",
    age: 22,
    role: "user",
    isActive: true,
    tags: ["react", "nodejs"],
  },
  {
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    username: "fionag",
    age: 28,
    role: "user",
    isActive: false,
    tags: ["design", "ui"],
  },
  {
    name: "George Clark",
    email: "george@example.com",
    username: "georgec",
    age: 55,
    role: "admin",
    isActive: true,
    tags: ["management", "security"],
  },
  {
    name: "Hannah Abbott",
    email: "hannah@example.com",
    username: "hannah_a",
    age: 34,
    role: "user",
    isActive: true,
    tags: ["backend", "express"],
  },
  {
    name: "Ian Malcolm",
    email: "ian@example.com",
    username: "ian_m",
    age: 48,
    role: "moderator",
    isActive: true,
    tags: ["math", "data"],
  },
  {
    name: "Julia Roberts",
    email: "julia@example.com",
    username: "juliar",
    age: 29,
    role: "user",
    isActive: true,
    tags: ["frontend", "css"],
  },
];

const seedData = async () => {
  try {
    await User.create(dummyUsers);
  } catch (error) {
    console.log(error);
  }
};

// seedData()

const getActiveAdmins = async () => {
  try {
    const docs = await User.find({ isActive: true, role: "admin" })
      .select("name email username -_id")
      .lean();
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};
// getActiveAdmins()

const getMidAgeUsers = async () => {
  try {
    const docs = await User.find()
      .where("age")
      .gte(25)
      .lte(45)
      .select("-password -__v")
      .sort({ age: -1 });
    console.log(docs);
  } catch (error) {
    console.log(error);
  }
};

// getMidAgeUsers()

const getUsersByTag = async (tag) => {
  try {
    const docs = await User.find({ isActive: true })
      .where("tags")
      .in([tag]);
    console.log({ count: docs.length, docs });
  } catch (error) {
    console.log(error);
  }
};

// getUsersByTag('nodejs')

const getPaginatedUsers = async (page, limit) => {
  const skip = (page - 1) * limit;
  try {
    const docs = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    console.log({
      page,
      limit,
      totalUsers: 10,
      totalPages: 4,
      data: docs,
    });
  } catch (error) {
    console.log(error);
  }
};

// getPaginatedUsers(1, 5);

const getUserProfile = async(userId) => {
    try {
        const docs = await User.findById(userId).lean()
        if(!docs){
            return console.log("User not Found")
        }
        console.log(docs)
    } catch (error) {
        console.log('Invalid User ID format')
    }
}

getUserProfile('6ac47e25511709d3f81')