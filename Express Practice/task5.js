import express from "express";
import path, { dirname } from "path";

const app = express();

const PORT = process.env.PORT || 3000;

const dirName = import.meta.dirname;
const filePath = path.join(dirName, "public");

app.use(express.static(filePath));

app.use(express.urlencoded({ extended: true }));

app.post("/submit-form", (req, res) => {
  const { username, message } = req.body;

  if (username === "" || message === "") {
    return res.status(404).send("All filed are required");
  }

  res.json({recieved: true, username, message})
});

app.listen(PORT, () => {
    console.log(`Server is Running on PORT: ${PORT}`)
})