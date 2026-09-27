import fs from "fs/promises"

export const saveToFile = async(filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data))
}

export const loadLinks = async(filePath) => {
    try{
        const fileData = await fs.readFile(filePath)
        return JSON.parse(fileData) || {}
    }catch(error){
        if(error.code === "ENOENT"){
            await fs.writeFile(filePath, JSON.stringify({}))
            return {}
        }
        throw error
    }
}