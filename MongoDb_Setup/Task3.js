import { MongoClient, ObjectId } from "mongodb";

const uri = 'mongodb://127.0.0.1:27017'

const client = new MongoClient(uri)

const run = async() => {
    try{
        await client.connect();
        const db = client.db("log");
        const logs = db.collection('logs');
        await logs.deleteMany({level: "deug"})
    }catch(error){
        console.log(error)
    }finally{
        client.close()
    }
}

run()