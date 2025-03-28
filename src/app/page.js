"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
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
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchSnippets();
    checkAdminStatus();
    toast.info("🚀 Welcome to CodeStorage", { autoClose: 30000, position: "top-center" });
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
      
      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-secondary" onClick={() => setShowSearch(!showSearch)}>
          <Search size={20} />
        </Button>
      </div>
      
      {showSearch && (
        <Form className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by name or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Form>
      )}
      
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
