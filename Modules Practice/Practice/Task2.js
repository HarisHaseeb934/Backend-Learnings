const path = require("path")

function pathUtil(pathStr){
    const pathNormalize = path.normalize(pathStr)
    const extensionName = path.extname(pathStr)
    const fileName = path.extname(pathStr, extensionName)

    console.log("Normalize Path: " + pathNormalize);
    console.log("Extension: " + extensionName);
    console.log("Name: " + fileName);
    console.log(path.resolve(pathNormalize))
}

pathUtil("./docs//projects/../file.txt")