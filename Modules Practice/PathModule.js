const path = require("path");

console.log("Path of the Dir " + __dirname);
console.log("Path of the File " + __filename);

const filePath = path.join("users", "Haris", "Docs", "Index.js");

console.log("Dynamic Genrated Path: " + filePath)

// Gives Absolute Path From C Drive
console.log("Absolute Path: " + path.resolve(filePath))

// Give Absolute Path from C but C\new
console.log("Absolute Specified Path: " + path.resolve("/new", filePath))

console.log("File Name: " + path.basename(filePath))

console.log("File Path Without Extension: " + path.basename(filePath, ".js"))

console.log("Dir Name: " + path.dirname(filePath))

console.log("Extension Name: " + path.extname(filePath));

console.log(path.parse(filePath));

console.log("Path is Absolute Path: " + path.isAbsolute(filePath))

console.log("Path Seprator: " + path.sep);