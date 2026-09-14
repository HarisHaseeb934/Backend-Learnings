const fs = require("fs");
const path = require("path");


const filePath = path.join(__dirname,"logs")
fs.existsSync(filePath)
fs.mkdirSync(filePath, {recursive: true})
fs.writeFileSync(path.join(filePath, "text.txt"), "Welcome to New File", "utf-8")
fs.appendFileSync(path.join(filePath, "text.txt"), "\n" +String(new Date()), "utf-8")

const message = fs.readFileSync(path.join(filePath, "text.txt"), "utf-8")
console.log(message)

