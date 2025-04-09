import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    if (!params.documentId || !ObjectId.isValid(params.documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("noteapp");
    const collection = db.collection("documents");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(params.documentId) },
      { 
        $set: {
          updatedAt: new Date(), 
          isArchived: true,
          archivedAt: new Date()
        } 
      },
      { returnDocument: "after" }
    );

    if (!result || !result.value) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.value);
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
    if (!params.documentId || !ObjectId.isValid(params.documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("noteapp");
    const collection = db.collection("documents");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(params.documentId) },
      { 
        $set: {
          updatedAt: new Date(), 
          isArchived: false,
          archivedAt: null
        } 
      },
      { returnDocument: "after" }
    );

    if (!result || !result.value) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.value);
  } catch (error) {
    console.error("Error restoring document:", error);
    return NextResponse.json(
      { error: "Failed to restore document" },
      { status: 500 }
    );
  }
}