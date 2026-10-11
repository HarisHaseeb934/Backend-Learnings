import express, { urlencoded } from "express";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import homeRoutes from './routes/homeRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from "cookie-parser";

const app = express();

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.use(authRoutes)
app.use(homeRoutes)

app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Server is Running on PORT: ${env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer()