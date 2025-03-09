"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Card } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark, coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [newSnippet, setNewSnippet] = useState({ name: "", language: "", code: "" });
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const response = await axios.get("/api/snippets");
      setSnippets(response.data);
    } catch (error) {
      console.error("Error fetching snippets:", error);
    }
  };

  const addSnippet = async () => {
    if (!newSnippet.name || !newSnippet.language || !newSnippet.code) {
      alert("Please fill all fields");
      return;
    }
    try {
      await axios.post("/api/snippets", newSnippet);
      setNewSnippet({ name: "", language: "", code: "" });
      fetchSnippets();
    } catch (error) {
      console.error("Error adding snippet:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center">Code Storage Hub</h1>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Snippet Name</Form.Label>
          <Form.Control
            type="text"
            value={newSnippet.name}
            onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Language</Form.Label>
          <Form.Select
            value={newSnippet.language}
            onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
          >
            <option value="">Select Language</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Code</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={newSnippet.code}
            onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
          />
        </Form.Group>

        <Button onClick={addSnippet} className="w-100">Add Snippet</Button>
      </Form>

      <h2 className="mt-4">Saved Snippets</h2>
      {snippets.length === 0 && <p>No snippets available.</p>}
      {snippets.map((snippet) => (
        <Card key={snippet._id} className="mt-3">
          <Card.Body>
            <Card.Title>{snippet.name} ({snippet.language})</Card.Title>
            <SyntaxHighlighter language={snippet.language} style={theme === "dark" ? dark : coy}>
              {snippet.code}
            </SyntaxHighlighter>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
