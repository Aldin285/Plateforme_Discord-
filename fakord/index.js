import mongoose from 'mongoose'
import User from './app/model/user.js';

// permet de detecter le fichier .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


mongoose.connect(process.env.URI)

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