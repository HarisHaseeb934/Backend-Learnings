import { MongoClient, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

async function seed() {
  const uri =
    "mongodb+srv://HarisHaseeb:haris0nM0ng0DB@cluster0.rgjojq6.mongodb.net/urlShortener";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client.db("urlShortener").collection("urlshorteners");
    const shortcodes = faker.helpers.uniqueArray(
      () => faker.string.alphanumeric(6), // e.g., "aB9x2Q"
      1000,
    );

    // 2. Map them into MongoDB documents with original URLs
    const documents = shortcodes.map((code) => ({
      shortCode: code,
      url: faker.internet.url(),
      user: new ObjectId('6af88ecad0d0cfc6150646cc'), // e.g., "https://fancy-river.org"
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    }));

    const result = await collection.insertMany(documents);
    console.log(`Inserted ${result.insertedCount} URLs.`);
  } catch (error) {
    console.log(error)
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
