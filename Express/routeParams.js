import express from "express"
import path from "path"

const app = express();

const PORT = process.env.PORT || 3000;

const dirPath = import.meta.dirname;
const filesPath = path.join(dirPath, "public");

app.use(express.static(filesPath))

app.get("/user/:userName", (req, res) => {
    const {userName} = req.params;
    res.send(`<h1>My Name is ${userName.split("-").join(" ")}</h1>`)
})

app.listen(PORT, (req, res) => {
    console.log(`Server is Running on PORT: ${PORT}`)
})