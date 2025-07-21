import mongoose from 'mongoose';
import { type } from 'os';
const { Schema, model } = mongoose;

const userSchema = new Schema({
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

// 'User' sera ajouter dans la BDD comme nouvelle collection en miniscule et en pluriel
const User = model('User', userSchema);
export default User;