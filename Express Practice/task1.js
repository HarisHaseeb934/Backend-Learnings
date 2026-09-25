import express from "express";
import path from "path";
import fs from "fs/promises";

const dirname = import.meta.dirname;
const filePath = path.join(dirname, "Json", "todos.json");

async function loadFile(filePath) {
  try {
    const todos = await fs.readFile(filePath);
    return JSON.parse(todos) || {};
  } catch (error) {
    if (error.cose === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify({}));
      return {};
    }
    throw error;
  }
}

const app = express();

const PORT = process.env.PORT;

app.get("/api/todos", async (req, res) => {
  const completed = req.query.completed;
  if (completed !== undefined) {
    const isCompleted = completed === "true"; 
    let todos = await loadFile(filePath);
    let filter = todos.todos.filter((todo) => todo.completed === isCompleted);
    res.json(filter);
  } else {
    let todos = await loadFile(filePath);
    console.log(todos);
    res.json(todos.todos);
  }
});

app.post("/api/todos", async(req, res) => {
    const {title} = req.body;
    if(title.trim() !== ""){
        let todos = await loadFile(filePath);
        let updated = {...todos, todos: [...todos.todos, {title: title, completed:false}]}
        res.status(201).send(ok)
    }
});

app.put("/api/todos/:id", async(req, res) => {
    const {id} = req.params;
    const {title} = req.body
    if(title.trim() !== ""){
        let todos = await loadFile(filePath);
        let updated = todos.todos.filter((todo) => todo.id === id ? {title: title, completed: true}: todo);
        res.status(201).send(ok)
    }
});

app.delete("/api/todos/:id", async(req, res) => {
    const {id} = req.params;
    const {title} = req.body
    if(title.trim() !== ""){
        let todos = await loadFile(filePath);
        let updated = todos.todos.filter((todo) => todo.id !== id);
        res.status(201).send(ok)
    }
});

app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
});
