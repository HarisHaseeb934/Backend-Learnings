import {client} from "../config/db_client.js"
import {env} from "../validators/env.js"

const db = client.db(env.MONGO_DB_NAME)
const collection = db.collection('links')

export const loadLinks = async() => {
    return await collection.find().toArray()  
}

export const saveLinks = async(link) => {
    await collection.insertOne(link)
}

export const getShortCode = async(short) => {
    return await collection.find({shortCode: short}).toArray()
}