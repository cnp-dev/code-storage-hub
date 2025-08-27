"use client";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdBanner from "../components/AdBanner";

export default function SnippetForm({ fetchSnippets }) {
  const [newSnippet, setNewSnippet] = useState({ name: "", language: "", code: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "typescript", label: "TypeScript" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "rust", label: "Rust" },
    { value: "sql", label: "SQL" },
  ];

  const addSnippet = async () => {
    if (!newSnippet.name || !newSnippet.language || !newSnippet.code) {
      toast.error("Please fill all fields!");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/snippets", newSnippet);
      setNewSnippet({ name: "", language: "", code: "" }); // Reset form
      fetchSnippets(); // Refresh snippet list
      toast.success("Snippet added successfully!");
    } catch (error) {
      console.error("Error adding snippet:", error);
      toast.error("Failed to add snippet!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <ToastContainer position="bottom-right" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-primary">Add New Snippet</h2>
        <AdBanner />
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="text-primary block text-sm font-medium mb-1">
              Snippet Name
            </label>
            <input
              id="name"
              type="text"
              className="text-primary w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              placeholder="Enter a descriptive name"
              value={newSnippet.name}
              onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="language" className="text-primary block text-sm font-medium mb-1">
              Language
            </label>
            <select
              id="language"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              value={newSnippet.language}
              onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
            >
              <option className="text-dark" value="">Select Language</option>
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="code" className="text-dark block text-sm font-medium mb-1">
              Code
            </label>
            <textarea
              id="code"
              rows={10}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 font-mono"
              placeholder="Paste your code here..."
              value={newSnippet.code}
              onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
            />
          </div>
          
          <div className="pt-2">
            <button
              onClick={addSnippet}
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add Snippet"}
            </button>
          </div>
        </div>
        <AdBanner />
      </div>
    </div>
  );
}