import mongoose from "mongoose";

export const authorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nationality: String,
  isVerified: {
    type: Boolean,
    default: true,
  },
});

export const Author = mongoose.model("Author", authorSchema);

export const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: String,
  price: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
});

export const Book = mongoose.model("book", bookSchema);


// Generate dummy ObjectIds for referencing
const authorIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const dummyAuthors = [
  {
    _id: authorIds[0],
    name: "George Orwell",
    nationality: "British",
    isVerified: true,
  },
  {
    _id: authorIds[1],
    name: "Haruki Murakami",
    nationality: "Japanese",
    isVerified: true,
  },
  {
    _id: authorIds[2],
    name: "Agatha Christie",
    nationality: "British",
    isVerified: true,
  },
  {
    _id: authorIds[3],
    name: "Gabriel García Márquez",
    nationality: "Colombian",
    isVerified: false,
  },
];

export const dummyBooks = [
  {
    title: "1984",
    genre: "Dystopian",
    price: 15.99,
    author: authorIds[0],
  },
  {
    title: "Animal Farm",
    genre: "Political Satire",
    price: 10.5,
    author: authorIds[0],
  },
  {
    title: "Norwegian Wood",
    genre: "Fiction",
    price: 14.25,
    author: authorIds[1],
  },
  {
    title: "Kafka on the Shore",
    genre: "Magical Realism",
    price: 18.0,
    author: authorIds[1],
  },
  {
    title: "Murder on the Orient Express",
    genre: "Mystery",
    price: 12.99,
    author: authorIds[2],
  },
  {
    title: "One Hundred Years of Solitude",
    genre: "Magical Realism",
    price: 16.5,
    author: authorIds[3],
  },
];

async function seedDatabase() {
  try {
    await Author.deleteMany({});
    await Book.deleteMany({});

    const createdAuthors = await Author.insertMany([
      { name: "George Orwell", nationality: "British", isVerified: true },
      { name: "Haruki Murakami", nationality: "Japanese", isVerified: true },
      { name: "Agatha Christie", nationality: "British", isVerified: true },
      {
        name: "Gabriel García Márquez",
        nationality: "Colombian",
        isVerified: false,
      },
    ]);

    const createdBooks = await Book.insertMany([
      {
        title: "1984",
        genre: "Dystopian",
        price: 15.99,
        author: createdAuthors[0]._id,
      },
      {
        title: "Animal Farm",
        genre: "Political Satire",
        price: 10.5,
        author: createdAuthors[0]._id,
      },
      {
        title: "Norwegian Wood",
        genre: "Fiction",
        price: 14.25,
        author: createdAuthors[1]._id,
      },
      {
        title: "Murder on the Orient Express",
        genre: "Mystery",
        price: 12.99,
        author: createdAuthors[2]._id,
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/practice");
  } catch (error) {
    console.log(error);
  }
};
// connectDB()

// seedDatabase();
