import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IMessage extends Document {
  sender : ObjectId;
  content : string;
  timestamp: Date;
}

const messageSchema = new Schema <IMessage>({
    
    sender: { type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            immutable: true
         },
    content: { type: String,
                required: true
            },
    timestamp: { type: Date,
         default: Date.now(),
         immutable: true, }
});

// export default mongoose.models.Room || mongoose.model<IMessage>("Room",roomSchema);