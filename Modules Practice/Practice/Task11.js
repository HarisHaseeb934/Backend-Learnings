const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "input_files");
const outFilePath = path.join(__dirname, "output_base64");

async function batch(){
    try{
        if(!fs.existsSync(filePath)){
            fs.mkdirSync(filePath, {recursive: true})
        }
        await Promise.all([
            fs.promises.writeFile(path.join(filePath, "text1.txt"), "File 1", "utf-8"),
            fs.promises.writeFile(path.join(filePath, "text2.txt"), "File 2", "utf-8"),
            fs.promises.writeFile(path.join(filePath, "text3.txt"), "File 3", "utf-8"),
        ])
        const dirName = await fs.promises.readdir(filePath)
        console.log(dirName)

        const read = await Promise.all([
            fs.promises.readFile(path.join(filePath, "text1.txt")),
            fs.promises.readFile(path.join(filePath, "text2.txt")),
            fs.promises.readFile(path.join(filePath, "text3.txt")),
        ]) 

        // console.log(read);
        let baseBuff = read.map(buff => buff.toString("base64"))

        let pro = baseBuff.map((base, index) => fs.promises.writeFile(path.join(outFilePath, `text${index+1}.txt`), base))
        if(!fs.existsSync(outFilePath)){
            fs.mkdirSync(outFilePath)
        }
        await Promise.all(pro)
        // console.log(baseBuff);
    }catch(err){
        console.log(err.message)
    }
}

batch()