import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  firstname : string;
  lastname : string;
  email:string;
  password:string;
  username: string;
  rooms?: [ObjectId];
  friends?: [ObjectId];
  birthday: Date;
  gender: string;
  dateOfCreation: Date;
}

const userSchema = new Schema <IUser>({
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

// 'User' sera ajouter dans la BDD comme nouvelle collection en miniscule et au pluriel
// const User = model('User', userSchema);

export default mongoose.models.User || mongoose.model<IUser>("User",userSchema);