import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/api/divide", (req, res, next) => {
  const { a, b } = req.query;
  try {
    if (a === undefined || b === undefined || b === "0") {
      const error = new Error("Division by Zero or invalid input");
      error.status = 400;
      throw error
    }
    res.send(a / b);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
    const status = error.status || 500
  res.status(status).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server in Running on PORT: ${PORT}`);
});
