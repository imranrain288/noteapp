import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId, Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import DocumentModel, { IDocument } from "@/models/document.model";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    if (!params.documentId || !isValidObjectId(params.documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const document = await DocumentModel.findByIdAndUpdate<IDocument>(
      params.documentId,
      { 
        $set: {
          isArchived: true,
          archivedAt: new Date()
        } 
      },
      { new: true }
    ).lean<IDocument>();

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...document,
      _id: (document._id as Types.ObjectId).toString()
    });
  } catch (error) {
    console.error("Error archiving document:", error);
    return NextResponse.json(
      { error: "Failed to archive document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    if (!params.documentId || !isValidObjectId(params.documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const document = await DocumentModel.findByIdAndUpdate<IDocument>(
      params.documentId,
      { 
        $set: {
          isArchived: false,
          archivedAt: null
        } 
      },
      { new: true }
    ).lean<IDocument>();

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...document,
      _id: (document._id as Types.ObjectId).toString()
    });
  } catch (error) {
    console.error("Error restoring document:", error);
    return NextResponse.json(
      { error: "Failed to restore document" },
      { status: 500 }
    );
  }
}