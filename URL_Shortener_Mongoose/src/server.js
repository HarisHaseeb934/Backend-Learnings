import express from "express";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import homeRoutes from "./routes/homeRoutes.js";
import { errorHandler } from "./middleware/errorHandlers.js";

const app = express();

app.set('view engine', 'ejs')
app.set('views', "./src/views")

app.use('/', homeRoutes)

async function startServer() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Server is Running on PORT: ${env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

app.use((req, res, next) => {
    next(new Error(`Not Found: ${req}`))
})

app.use(errorHandler)

startServer()