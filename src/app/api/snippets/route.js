import { connectToDatabase } from "@/lib/mongodb";
import Snippet from "../../models/Snippet";
import { NextResponse } from "next/server";

// ✅ GET: Fetch all snippets
export async function GET() {
  await connectToDatabase();
  const snippets = await Snippet.find({});
  return NextResponse.json(snippets);
}

// ✅ POST: Add a new snippet
export async function POST(req) {
  await connectToDatabase();
  const { name, language, code } = await req.json();

  if (!name || !language || !code) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const newSnippet = new Snippet({ name, language, code });
  await newSnippet.save();
  
  return NextResponse.json(newSnippet, { status: 201 });
}

// ✅ DELETE: Delete a snippet
export async function DELETE(req) {
  await connectToDatabase();
  const { id } = await req.json();

  const deletedSnippet = await Snippet.findByIdAndDelete(id);
  return NextResponse.json({ message: "Snippet deleted successfully" }, { status: 200 });
}
