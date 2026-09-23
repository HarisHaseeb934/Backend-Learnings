import express from "express"
import path from "path"

const app = express()

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(import.meta.dirname, "public")))

// app.get("/", (req, res) => {
//     res.send()
// })

app.listen(PORT, () => {
    console.log("Server is Running")
})