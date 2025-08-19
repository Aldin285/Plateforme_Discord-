import mongoose from 'mongoose'

// permet de detecter le fichier .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI)
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
export default connectDB;