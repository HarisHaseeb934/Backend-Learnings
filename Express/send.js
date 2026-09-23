import express from "express"
import path from "path"

const app = express()

const PORT = process.env.PORT;


const dirPath = import.meta.dirname;
const filePath = path.join(dirPath, "public", "index.html")

app.get("/", (req, res) => {
    res.sendFile(filePath)
})

app.listen(PORT, () => {
    console.log("Server is Running on " + PORT);
})