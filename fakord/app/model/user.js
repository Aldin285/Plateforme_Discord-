import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  
   firstname: {
      type: String,
      required: true,
    },
  
    lastname: {
      type: String,
      required: true,
    },
  
    email: {
      type: String,
      required: true,
    },
    
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    
    // Il faudra ajouter le nom du shéma de la room dans le ref
     //les ID au lieu des noms en cas où le nom est modifié
    rooms: [{ type: Schema.Types.ObjectId, ref: '' }],
    
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
    birthday: {
      type: Date,
      required: true,
    },
  
    gender:{
      type: String,
      required: true,
    },
  
    dateOfCreation: {
      type: Date,
      default: () => Date.now(),
      immutable: true,
    }
});

// 'User' sera ajouter dans la BDD comme nouvelle collection en miniscule et en pluriel
const User = mongoose.models.User || mongoose.model("User",userSchema);
export default User;