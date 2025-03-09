import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Snippet || mongoose.model("Snippet", SnippetSchema);
