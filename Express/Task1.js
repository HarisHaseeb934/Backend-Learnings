import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ port: PORT, mode: process.env.NODE_ENV || "development" });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
