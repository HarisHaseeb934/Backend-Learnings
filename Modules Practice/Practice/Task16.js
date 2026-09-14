const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const EventEmitter = require("events");

const emitter = new EventEmitter();



const readable = fs.createReadStream("data.txt")
const hash = crypto.createHash('sha256');

readable.on("data", (chunk) => {
    hash.update(chunk)
})

readable.on("end", () => {
    let stat = fs.statSync(path.join("data.txt"))
    console.log(stat.size)
    hash.digest("hex");
    fs.writeFileSync(path.join("audit_report.json"), JSON.stringify({ fileName: "data.txt", fileSize: stat.size, sha256Hash: "sha256", auditedAt: new Date() }), "utf-8")
})