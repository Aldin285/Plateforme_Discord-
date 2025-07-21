import { MongoClient } from "mongodb";

// permet de detecter le fichier .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const URI = process.env.URI;
if (!URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = URI;

const client = new MongoClient(uri);


async function run() {
  try {
    const db = client.db('ChatDB');
    const users = db.collection('Users');

    // Afficher les collections présentes dans la BDD
    // const colls = database.listCollections();
    // for await (const doc of colls) {
    //     console.log(doc)
    // }

    // Trouver un utilisateur avec son nom
    const user = {lastname:"Doe"}
    const userFind = await users.find({lastname: "Doe"})
    const result = await userFind.toArray();
    console.log("---------------------------")
    console.log(result)
    console.log("---------------------------")



  } finally {
    await client.close();
  }
}
run().catch(console.dir);