import mongoose from "mongoose";
import { Book } from "./BookSchema.js";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/practice");
  } catch (error) {
    console.log(error);
  }
};

connectDB()

const getAllBooksWithAuthors = async() => {
    try {
        const docs = await Book.find().populate('author', 'name nationality -_id ').lean()
        console.log(docs)
    } catch (error) {
        console.log(error)
    }
}

// getAllBooksWithAuthors()

const getBooksWithVerifiedAuthors = async() => {
    try {
        const docs = await Book.find().populate({
            path: 'author',
            match: {isVerified: true}
        })
        
        console.log(docs.filter(doc => doc.author !== null))
    } catch (error) {
        console.log(error)
    }
}

getBooksWithVerifiedAuthors()

const getBooksByGenre = async(genreName) => {
  try {
    const doc = await Book.find({genre: genreName}).populate('author').lean()
    console.log("Get Books: ", doc)
  } catch (error) {
    console.log(error)
  }
}

// getBooksByGenre('Fiction')