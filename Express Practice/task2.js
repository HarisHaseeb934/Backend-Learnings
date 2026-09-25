import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const dirname = import.meta.dirname;
const filePath = path.join(dirname, "public");

app.use(express.static(filePath));

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(dirname, "public", "dashboard.html"))
});

app.listen(PORT, () => {
    console.log(`Server is Running on PORT: ${PORT}`)
})