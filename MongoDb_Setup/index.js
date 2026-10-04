import {MongoClient} from "mongodb"

const uri = 'mongodb://127.0.0.1'

const client = new MongoClient(uri)

const coonectdb = async() => {
    await client.connect()
    let db = client.db('shop')
    let collection = db.collection('products')

    const data = await collection.find({price: {$gt: 1200}}).toArray()
    console.log(data)
    return "y"
}

coonectdb().then(d => console.log(d)).catch(e => console.log(e)).finally(() => client.close())