const fs = require("fs")
const path = require("path")
const zlib = require("zlib")

const readable = fs.createReadStream(path.join("input.txt"), {
    encoding: "utf-8",
    highWaterMark: 64
})

const writable = fs.createWriteStream(path.join("input.txt.gz"))
const gzip = zlib.createGzip();

readable.pipe(gzip).pipe(writable).on("finish", () => console.log("Finish"));