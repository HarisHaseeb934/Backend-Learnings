const path = require("path")
const fs = require("fs")

const {systemInfo} = require("./Task1.js")
console.log(systemInfo())

console.log(fs.existsSync("reports"))
fs.mkdirSync(path.join("reports"))
fs.writeFileSync(path.join("reports", "system_report.json"), JSON.stringify(systemInfo(), null, 2), "utf-8")
const message = JSON.parse(fs.readFileSync(path.join("reports", "system_report.json"), "utf-8"))
console.log(message)