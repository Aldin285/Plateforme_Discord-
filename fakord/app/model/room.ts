import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IRoom extends Document {
  name : string;
  createdBy : ObjectId;
  currentOwner:ObjectId;
  substitute:ObjectId;
  members: [ObjectId];
  messages?: [{
    sender: ObjectId;
    content: string;
    timestamp: Date;  
  }];

  dateOfCreation: Date;
}

const roomSchema = new Schema <IRoom>({
 name: {
    type: String,
    required: true,
    unique: true,
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  },
  
  // Chef
  currentOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Sous-chef
  substitute: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  messages: [{
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, immutable: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now(),immutable: true, }
  }],

  dateOfCreation: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  }
});

// 'User' sera ajouter dans la BDD comme nouvelle collection en miniscule et au pluriel
// const User = model('User', userSchema);

export default mongoose.models.Room || mongoose.model<IRoom>("Room",roomSchema);