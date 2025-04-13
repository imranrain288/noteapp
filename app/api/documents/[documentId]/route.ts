import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId, Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import DocumentModel, { IDocument } from "@/models/document.model";

export async function GET(
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

    const document = await DocumentModel.findById(params.documentId).lean<IDocument>();

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
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    const updates = await req.json();
    await connectDB();

    // Parse content if it's a string
    if (typeof updates.content === 'string') {
      try {
        JSON.parse(updates.content); // Validate JSON
      } catch (e) {
        return NextResponse.json(
          { error: "Invalid content format" },
          { status: 400 }
        );
      }
    }

    const document = await DocumentModel.findByIdAndUpdate<IDocument>(
      params.documentId,
      { 
        $set: updates,
        $currentDate: { updatedAt: true }
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
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

    const document = await DocumentModel.findByIdAndDelete(params.documentId).lean<IDocument>();

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
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}