"use client";
import { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark, coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SnippetList({ snippets, theme, fetchSnippets }) {
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  const deleteSnippet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this snippet?")) return;
    try {
      await axios.delete(`/api/snippets/${id}`);
      fetchSnippets(); // Refresh list after deletion
      toast.success("Snippet deleted successfully!", { autoClose: 2000 });
    } catch (error) {
      console.error("Error deleting snippet:", error);
      toast.error("Failed to delete snippet!", { autoClose: 2000 });
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!", { autoClose: 1500 });
  };

  const handleViewSnippet = (snippet) => {
    setSelectedSnippet(snippet);
    toast.info(`Viewing: ${snippet.name}`, { autoClose: 1500 });
  };

  return (
    <>
      <ToastContainer />
      <h2 className="mt-4">Saved Snippets</h2>
      {snippets.length === 0 && <p>No snippets available.</p>}
      {snippets.map((snippet) => (
        <Card key={snippet._id} className="mt-3 shadow-sm">
          <Card.Body>
            <Card.Title>{snippet.name} ({snippet.language})</Card.Title>
            <Button variant="primary" size="sm" onClick={() => handleViewSnippet(snippet)}>
              View Code
            </Button>
            <Button variant="success" size="sm" className="ms-2" onClick={() => copyToClipboard(snippet.code)}>
              Copy Code
            </Button>
            <Button variant="danger" size="sm" className="ms-2" onClick={() => deleteSnippet(snippet._id)}>
              Delete
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* Code Modal */}
      <Modal show={!!selectedSnippet} onHide={() => setSelectedSnippet(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedSnippet?.name} ({selectedSnippet?.language})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SyntaxHighlighter language={selectedSnippet?.language} style={theme === "dark" ? dark : coy}>
            {selectedSnippet?.code}
          </SyntaxHighlighter>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedSnippet(null)}>Close</Button>
          <Button variant="success" onClick={() => copyToClipboard(selectedSnippet?.code)}>Copy Code</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
