import express from "express";
import path from "path";

const app = express();

const PORT = process.env.PORT || 3000;


const currDir = import.meta.dirname
const filesDir = path.join(currDir, "public")
app.use(express.static(filesDir))

app.use("/contact", express.urlencoded({extended: true}))

app.post("/contact", (req, res) => {
    console.log(req.body)
    res.send("ok")
})

app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
});
