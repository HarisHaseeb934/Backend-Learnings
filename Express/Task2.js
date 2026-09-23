import express from "express";

const app = express();

const parse = process.argv;

const PORT = process.env.PORT || 3000;

app.get("/admin", (req, res) => {
  if (parse) {
    return res.send("Welcome Admin!");
  } else {
    return res.send("Admin flag not enabled on startup");
  }
});

app.listen(PORT, () => {
  console.log("Running");
});
