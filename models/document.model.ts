import { Schema, model, models, Document } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  content: string;
  userId: string;
  parentDocumentId: string | null;
  isArchived: boolean;
  archivedAt?: Date | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      required: true,
    },
    parentDocumentId: {
      type: String,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const DocumentModel = models.Document || model<IDocument>('Document', documentSchema);

export default DocumentModel;
