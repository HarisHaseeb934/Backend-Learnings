import express from "express";
import path from "path";

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/api/profile", (req, res, next) => {
  const age = req.query.age;
    console.log(age)
  if (age === undefined || isNaN(age)) {
    const error = new Error("Age must be a valid number");
    error.status = 400;
    next(error);
  } else if (age < 18) {
    const error = new Error("Access denied: You must be at least 18");
    error.status = 403;
    next(error);
  } else if (age > 18) {
    return res.status(200).json({ access: "granted", age: Number(age) });
  }
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({ status: error.status, message: error.message });
});

app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
});
