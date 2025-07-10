"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SnippetList({ snippets, theme, fetchSnippets }) {
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", code: "", language: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");

  const deleteSnippet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this snippet?")) return;

    try {
      await axios.delete(`/api/snippets/${id}`);
      fetchSnippets();
      toast.success("Snippet deleted successfully!");
    } catch (error) {
      console.error("Error deleting snippet:", error);
      toast.error("Failed to delete snippet!");
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleViewSnippet = (snippet) => {
    setSelectedSnippet(snippet);
    setEditMode(false);
  };

  const handleEditSnippet = (snippet) => {
    setEditMode(true);
    setEditData({ ...snippet });
    setSelectedSnippet(snippet);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSnippet = async () => {
    try {
      await axios.put(`/api/snippets/${editData._id}`, editData);
      fetchSnippets();
      toast.success("Snippet updated successfully!");
      setSelectedSnippet(null);
    } catch (error) {
      console.error("Error updating snippet:", error);
      toast.error("Failed to update snippet!");
    }
  };

  // Get unique languages for filter dropdown
  const languages = [...new Set(snippets.map(snippet => snippet.language))];

  // Filter snippets based on search term and language filter
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        snippet.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === "" || snippet.language === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="max-w-6xl mx-auto px-4">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-8">
        <h2 className="text-2xl font-bold">Code Snippets</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              className="w-full py-2 pl-3 pr-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              placeholder="Search snippets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full sm:w-40">
            <select
              className="w-full py-2 pl-3 pr-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 appearance-none"
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredSnippets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-5xl mb-4">💻</div>
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
            {snippets.length === 0 ? "No snippets available." : "No matching snippets found."}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {snippets.length === 0 ? "Create your first snippet to get started!" : "Try adjusting your search or filter."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSnippets.map((snippet) => (
          <div 
            key={snippet._id} 
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h5 className="font-semibold text-lg truncate text-secondary" title={snippet.name}>
                  {snippet.name}
                </h5>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {snippet.language}
                </span>
              </div>
              
              <div className="h-24 overflow-hidden mb-4 bg-gray-50 dark:bg-gray-900 rounded p-2">
                <SyntaxHighlighter 
                  language={snippet.language} 
                  style={theme === "dark" ? vscDarkPlus : vs}
                  customStyle={{ margin: 0, padding: "0.5rem", fontSize: "0.75rem", height: "100%" }}
                  showLineNumbers={false}
                >
                  {snippet.code.length > 150 ? snippet.code.slice(0, 150) + "..." : snippet.code}
                </SyntaxHighlighter>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewSnippet(snippet)}
                  className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditSnippet(snippet)}
                  className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => copyToClipboard(snippet.code)}
                  className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                >
                  Copy
                </button>
                <button
                  onClick={() => deleteSnippet(snippet._id)}
                  className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Viewing or Editing */}
      {selectedSnippet && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-80"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full"
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-headline"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  {editMode ? (
                    <h3 className="text-lg font-medium text-secondary" id="modal-headline">
                      Edit Snippet
                    </h3>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-secondary" id="modal-headline">
                        {selectedSnippet.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-secondary">
                        Language: {selectedSnippet.language}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedSnippet(null)}
                    className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    &times;
                  </button>
                </div>

                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                        value={editData.name}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium mb-1">
                        Language
                      </label>
                      <input
                        type="text"
                        id="language"
                        name="language"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                        value={editData.language}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium mb-1">
                        Code
                      </label>
                      <textarea
                        id="code"
                        name="code"
                        rows="12"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 font-mono text-sm"
                        value={editData.code}
                        onChange={handleEditChange}
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                    <SyntaxHighlighter 
                      language={selectedSnippet.language} 
                      style={theme === "dark" ? vscDarkPlus : vs}
                      showLineNumbers={true}
                      wrapLines={true}
                      customStyle={{ margin: 0 }}
                    >
                      {selectedSnippet.code}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 bg-gray-50 dark:bg-gray-900">
                <button
                  type="button"
                  onClick={() => setSelectedSnippet(null)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
                
                {editMode ? (
                  <button
                    type="button"
                    onClick={handleUpdateSnippet}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedSnippet.code)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Copy Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}