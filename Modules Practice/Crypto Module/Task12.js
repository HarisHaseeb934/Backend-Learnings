const crypto = require("crypto")
const fs = require("fs")
const path = require("path")

async function checkSumGen(fileName){
    try{
        if(!fs.existsSync(fileName)){
            throw new Error("File didnot exists")
        }
        const readFileData = await fs.promises.readFile(fileName, "utf-8")
        const checkSum = crypto.createHash("sha256").update(readFileData).digest("hex");
        console.log(checkSum)
    }catch(error){
        console.log(error.message)
    }
}

checkSumGen("data.txt")