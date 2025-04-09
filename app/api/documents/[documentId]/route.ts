import { NextRequest, NextResponse } from "next/server";
import { ObjectId, FindOneAndUpdateOptions } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(
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

    const document = await collection.findOne({
      _id: new ObjectId(params.documentId)
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...document,
      _id: document._id.toString()
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
    if (!params.documentId || !ObjectId.isValid(params.documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    const updates = await req.json();
    const client = await clientPromise;
    const db = client.db("noteapp");
    const collection = db.collection("documents");

    const options: FindOneAndUpdateOptions = { returnDocument: "after" };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(params.documentId) },
      { $set: updates },
      options
    );

    if (!result || !result.value) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...result.value,
      _id: result.value._id.toString()
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
    if (!params.documentId || !ObjectId.isValid(params.documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("noteapp");
    const collection = db.collection("documents");

    const result = await collection.findOneAndDelete({
      _id: new ObjectId(params.documentId)
    });

    if (!result || !result.value) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...result.value,
      _id: result.value._id.toString()
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}