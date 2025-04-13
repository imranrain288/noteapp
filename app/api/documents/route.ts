import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DocumentModel, { IDocument } from "@/models/document.model";
import { Types, isValidObjectId } from 'mongoose';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const parentDocumentId = searchParams.get('parentDocumentId');
    const trash = searchParams.get('trash');

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    let query: any = { userId };
    
    if (trash === 'true') {
      query.isArchived = true;
    } else {
      query.parentDocumentId = parentDocumentId || null;
      query.isArchived = { $ne: true };
    }

    const documents = await DocumentModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean<IDocument[]>();

    return NextResponse.json(
      documents.map(doc => ({
        ...doc,
        _id: (doc._id as Types.ObjectId).toString()
      }))
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.title || !data.userId) {
      return NextResponse.json(
        { error: "Title and userId are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const document = new DocumentModel({
      ...data,
      content: "",
      isArchived: false,
      isPublished: false
    }) as IDocument;

    await document.save();

    const doc = document.toJSON();
    return NextResponse.json({
      ...doc,
      _id: (doc._id as Types.ObjectId).toString()
    });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    
    if (!documentId || !isValidObjectId(documentId)) {
      return NextResponse.json(
        { error: "Valid document ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Find and delete the document
    const document = await DocumentModel.findByIdAndDelete(documentId).lean<IDocument>();

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Document deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}