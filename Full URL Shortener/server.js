import express from "express";
import homeRoutes from "./routes/homeRoutes.js"

const app = express();

const PORT = process.env.PORT || 3001;

app.use(homeRoutes)

app.set("view engine", "ejs")

app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
});
