import express from "express";
import path from "path";
import fs from "fs/promises";

const currDirName = import.meta.dirname;
const BOOKS = path.join(currDirName, "Json", "books.json");

async function loadData(filePath) {
  try {
    const books = await fs.readFile(filePath);
    return JSON.parse(books);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify([]));
      return [];
    }
    throw error;
  }
}

async function saveFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data));
}

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/books", async (req, res) => {
  try {
    const category = req.query.category;
    const books = await loadData(BOOKS);
    if (category !== undefined) {
      const filterBooks = books.filter((book) => book.category === category);
      return res.json(filterBooks);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to read books" });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const { title, category } = req.body;

    if (title !== undefined && category !== undefined) {
      let books = await loadData(BOOKS);
      books = [...books, { title, category, id: Date.now() }];
      await saveFile(BOOKS, books);
      return res.status(201).json(books);
    }
    res.status(404).send("Invalid Data");
  } catch (error) {
    res.status(500).json({ error: "Failed to create book" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const books = await loadData(BOOKS);
  const filter = books.filter((book) => book.id !== Number(id));
  await saveFile(BOOKS, filter);
  res.json({ message: "Book removed" });
});

app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
});
