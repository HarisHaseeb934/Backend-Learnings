const fs = require("fs/promises");
const path = require("path");

// fs.writeFile(path.join("text.txt"), "Async using Promise", "utf-8")
//   .then((data) => console.log("Successfully Write"))
//   .catch((err) => console.log(err));

fs.readFile(path.join("text.txt"), "utf-8")
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
