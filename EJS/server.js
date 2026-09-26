import express from "express";

const app = express();

const PORT = process.env.PORT || 3001;

app.set("view engine", "ejs");

app.get("/profile", (req, res) => {
  const user = {
    username: "haris_dev",
    isPremium: true,
    skills: ["JavaScript", "Express", "Node.js", "React"],
  };
  res.render("profile", {user});
});

app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
});
