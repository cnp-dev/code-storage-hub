"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form } from "react-bootstrap";
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

  useEffect(() => {
    fetchSnippets();
    checkAdminStatus();
    toast.info("🚀 Welcome to CodeStorage by rrgs_dev!", { autoClose: 300000, position: "top-center" });
  }, []);

  const fetchSnippets = async () => {
    try {
      const response = await axios.get("/api/snippets");
      setSnippets(response.data);
    } catch (error) {
      console.error("Error fetching snippets:", error);
    }
  };

  const checkAdminStatus = async () => {
    // Simulate checking admin role (Replace with real API call)
    setIsAdmin(true); // Change to `false` for normal users
  };

  const filteredSnippets = snippets
    .filter(snippet =>
      snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return a.language.localeCompare(b.language);
      }
    });

  return (
    <Container className={`mt-4 ${theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"}`}>
      <ToastContainer />
      <h1 className="text-center">Code Storage Hub</h1>
      <ThemeToggle theme={theme} setTheme={setTheme} />
      
      <Form className="my-3">
        <Form.Control
          type="text"
          placeholder="Search by name or language..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form>
      
      <Form.Select
        className="mb-3"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="name">Sort by Name</option>
        <option value="language">Sort by Language</option>
      </Form.Select>
      
      {isAdmin && <SnippetForm fetchSnippets={fetchSnippets} />}
      <SnippetList snippets={filteredSnippets} theme={theme} fetchSnippets={fetchSnippets} isAdmin={isAdmin} />
    </Container>
  );
}
