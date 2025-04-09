import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

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

    const client = await clientPromise;
    const db = client.db("noteapp");
    const collection = db.collection("documents");

    let query: any = { userId };
    
    if (trash === 'true') {
      query.isArchived = true;
    } else {
      query.parentDocumentId = parentDocumentId || null;
      query.isArchived = { $ne: true };
    }

    const documents = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      documents.map(doc => ({
        ...doc,
        _id: doc._id.toString()
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

    const client = await clientPromise;
    const db = client.db("noteapp");
    const collection = db.collection("documents");

    const document = {
      ...data,
      content: "",
      isArchived: false,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(document);

    if (!result.insertedId) {
      throw new Error("Failed to insert document");
    }

    return NextResponse.json({
      ...document,
      _id: result.insertedId.toString()
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
    
    if (!documentId || !ObjectId.isValid(documentId)) {
      return NextResponse.json(
        { error: "Valid document ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("noteapp");
    const collection = db.collection("documents");
    
    // First find the document to ensure it exists
    const document = await collection.findOne({
      _id: new ObjectId(documentId)
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Then delete it
    const deleteResult = await collection.deleteOne({
      _id: new ObjectId(documentId)
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
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