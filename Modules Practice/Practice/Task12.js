const fs = require("fs")
const path = require("path")

fs.promises.readFile(path.join(__dirname, "raw_access.log"), "utf-8").then(data => {
    const str = data.split("\n")
    const replacedStr = str.map(a => a.replace(a, "XXX.XXX.XXX.XXX"))
    console.log(replacedStr.join(",").replaceAll(",", "\n"))
    const buff = Buffer.from(replacedStr);
    return buff
}).then(buff => {
    if(!fs.existsSync(path.join("clean_logs"))){
        fs.promises.mkdir(path.join("clean_logs"), {recursive: true})
    }
    return fs.promises.writeFile(path.join("clean_logs", "anonymized.log"), buff)
}).catch(error => {
    console.log(error)
})