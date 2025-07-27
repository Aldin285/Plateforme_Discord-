import { type } from 'os';

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  firstname : string;
  lastname : string; 
  dateOfCreation: Date;
  rooms: [Number];
  info:{
    birthday:Date,
    gender: string,
  };
}

const userSchema = new Schema <IUser>({
  _id: {
    type: String,
  },

  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  dateOfCreation: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  //les ID des salons au lieu des nom
  rooms: [Number],
  info: {
    birthday: Date,
    gender: String,
  }
});

// 'User' sera ajouter dans la BDD comme nouvelle collection en miniscule et au pluriel
// const User = model('User', userSchema);

export default mongoose.models.User || mongoose.model<IUser>("User",userSchema);