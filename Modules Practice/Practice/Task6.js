const fs = require("fs");
const path = require("path");

fs.promises
  .readFile(path.join("Pr Files", "source.txt"), "utf-8")
  .then((data) =>
    fs.promises.writeFile(path.join("Pr Files", "dest.txt"), data, "utf-8"),
  )
  .then(() => fs.promises.unlink(path.join("Pr Files", "source.txt")))
  .catch(err => console.log(err));
