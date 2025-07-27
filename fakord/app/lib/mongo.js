import mongoose from 'mongoose'
import User from '@/app/model/user.js';

// permet de detecter le fichier .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


const connectDB = async () => {
  try {
    mongoose.connect(process.env.URI)
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
export default connectDB;


// ajouter un user dans la liste
const newUser = new User({
  firstname: "Ada",
  lastname: "Wong",
  dateOfCreation: undefined,
  rooms: [1,5,4],
  info: {
    birthday: '1974-01-01',
    gender: "Female",
  } 
});
// Insert the article in our MongoDB database
// await newUser.save();

// Pour vérifier si le nouveau user sera présent dans la BDD
// const findUser = await User.findOne({firstname:"Ada"});
// console.log("---------------------------------");
// console.log(findUser);
// console.log("---------------------------------");








// import { MongoClient } from "mongodb";

// // permet de detecter le fichier .env.local
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env.local' });

// const URI = process.env.URI;
// if (!URI) {
//   throw new Error('Please define the MONGODB_URI environment variable');
// }

// const uri = URI;

// const client = new MongoClient(uri);


// async function run() {
//   try {
//     const db = client.db('ChatDB');
//     const users = db.collection('Users');

//     // Afficher les collections présentes dans la BDD
//     // const colls = database.listCollections();
//     // for await (const doc of colls) {
//     //     console.log(doc)
//     // }

//     // Trouver un utilisateur avec son nom
//     const user = {lastname:"Doe"}
//     const userFind = await users.find({lastname: "Doe"})
//     const result = await userFind.toArray();
//     console.log("---------------------------")
//     console.log(result)
//     console.log("---------------------------")



//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);