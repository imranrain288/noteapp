import { Schema, model, models, Document } from 'mongoose'

interface INote extends Document {
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

// Check if the model exists, if not create it
const Note = models.Note || model<INote>('Note', noteSchema)

export default Note
export type { INote }
