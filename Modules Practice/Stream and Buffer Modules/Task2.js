const fs = require("fs");
const path = require("path");

const readable = fs.createReadStream(path.join("input.txt"), {
    // encoding: "utf-8",
    highWaterMark: 64,
})

readable.on("data", (chunk) => {
    console.log("Received chunk of size:" , chunk.length)
})

readable.on("end", () => {
    console.log("Finished File Processing")
})