import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("contact", { success: false});
});

app.post("/contact", (req, res) => {
  const { sender, message } = req.body;
  res.render("contact", { success: true, sender });
});

app.listen(PORT, () => {
    console.log(`Server is Running on PORT: ${PORT}`)
})