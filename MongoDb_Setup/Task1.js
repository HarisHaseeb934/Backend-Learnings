import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

await client.connect();

const db = client.db("school");

const students = db.collection("students");

await students.insertMany([
  { _id: "650000000000000000000100", name: "Soban", grade: "A" },
//   { name: "Alex", grade: "B" },
]);

const data = await students.find().toArray();

console.log(data);

client.close();
