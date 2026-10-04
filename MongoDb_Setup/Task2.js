import { MongoClient, ObjectId } from "mongodb";

const uri = 'mongodb://127.0.0.1:27017'

const client = new MongoClient(uri)

await client.connect();

const db = client.db('school')
const students = db.collection('students')

const data = await students.find({_id: '650000000000000000000100'}).toArray()
// console.log(new ObjectId(data.at(0)._id))
await students.updateOne({_id: data.at(0)._id}, {$set: {_id: new ObjectId(data.at(0)._id)}})

client.close()
