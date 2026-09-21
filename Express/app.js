import express from "express";

// $env:PORT=3000; node --watch .\app.js

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/user", (req, res) => {
    res.send(`<h1>Hello World!</h1>`)
})

app.listen(PORT, () => {
    console.log(`Server is Running on PORT: ${PORT}`)
})