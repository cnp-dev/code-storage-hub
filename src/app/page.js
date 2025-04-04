"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import SnippetForm from "../components/SnippetForm";
import SnippetList from "../components/SnippetList";
import ThemeToggle from "../components/ThemeToggle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSnippets();
    checkAdminStatus();

    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";

    toast.info("🚀 Welcome to CodeStorage", {
      autoClose: 3000,
      position: "top-center",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }, [theme]);

  const fetchSnippets = async () => {
    try {
      const response = await axios.get("/api/snippets");
      setSnippets(response.data);
      
    } catch (error) {
      console.error("Error fetching snippets:", error);
      toast.error("❌ Failed to load snippets");
    }
  };

  const checkAdminStatus = async () => {
    setIsAdmin(true);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    toast.info(showForm ? "Form closed" : "Form opened", {
      autoClose: 2000,
      theme: "dark",
    });
  };

  const filteredSnippets = snippets
    .filter(snippet =>
      snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "language") {
        return a.language.localeCompare(b.language);
      } else if (sortOption === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return 0;
    });

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <ToastContainer position="top-right" theme= "dark" />

      <nav className="bg-gray-800 dark:bg-gray-950 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="flex-shrink-0 text-xl font-bold text-white">
                Code Storage Hub
              </span>
            </div>

            <div className="flex items-center">
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isAdmin && (
          <div className="mb-8">
            <button
              onClick={toggleForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showForm ? "Hide Form" : "Add New Snippet"}
            </button>

            {showForm && (
              <div className="mt-4">
                <SnippetForm fetchSnippets={fetchSnippets} theme={theme} />
              </div>
            )}
          </div>
        )}

        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="block text-sm font-medium mb-1">
                Search
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                  placeholder="Search by name or language..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    toast.info("🔍 Search updated", {
                      autoClose: 1500,
                      theme: theme === "dark" ? "dark" : "light",
                    });
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">🔍</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-48">
              <label htmlFor="sort" className="block text-sm font-medium mb-1">
                Sort By
              </label>
              <select
                id="sort"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white dark:bg-gray-800"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  toast.success(`🧹 Sorted by ${e.target.value}`, {
                    autoClose: 2000,
                    theme: theme === "dark" ? "dark" : "light",
                  });
                }}
              >
                <option value="name">Sort by Name</option>
                <option value="language">Sort by Language</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredSnippets.length} of {snippets.length} snippets
          </div>
        </div>

        <SnippetList 
          snippets={filteredSnippets} 
          theme={theme} 
          fetchSnippets={fetchSnippets} 
          isAdmin={isAdmin} 
        />
      </main>

      <footer className="bg-gray-800 dark:bg-gray-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Code Storage Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
