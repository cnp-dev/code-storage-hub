"use client";
import { useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark, coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SnippetList({ snippets, theme, fetchSnippets }) {
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", code: "", language: "" });

  const deleteSnippet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this snippet?")) return;

    try {
      await axios.delete(`/api/snippets/${id}`);
      fetchSnippets();
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
    setEditMode(false);
    toast.info(`Viewing: ${snippet.name}`, { autoClose: 1500 });
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
      toast.success("Snippet updated successfully!", { autoClose: 2000 });
      setSelectedSnippet(null);
    } catch (error) {
      console.error("Error updating snippet:", error);
      toast.error("Failed to update snippet!", { autoClose: 2000 });
    }
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
              View
            </Button>
            <Button variant="warning" size="sm" className="ms-2" onClick={() => handleEditSnippet(snippet)}>
              Edit
            </Button>
            <Button variant="success" size="sm" className="ms-2" onClick={() => copyToClipboard(snippet.code)}>
              Copy
            </Button>
            <Button variant="danger" size="sm" className="ms-2" onClick={() => deleteSnippet(snippet._id)}>
              Delete
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* Modal for Viewing or Editing */}
      <Modal show={!!selectedSnippet} onHide={() => setSelectedSnippet(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Edit Snippet" : `${selectedSnippet?.name} (${selectedSnippet?.language})`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editMode ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={editData.name} onChange={handleEditChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Language</Form.Label>
                <Form.Control name="language" value={editData.language} onChange={handleEditChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Code</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  name="code"
                  value={editData.code}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          ) : (
            <SyntaxHighlighter language={selectedSnippet?.language} style={theme === "dark" ? dark : coy}>
              {selectedSnippet?.code}
            </SyntaxHighlighter>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedSnippet(null)}>
            Close
          </Button>
          {editMode ? (
            <Button variant="primary" onClick={handleUpdateSnippet}>
              Save Changes
            </Button>
          ) : (
            <Button variant="success" onClick={() => copyToClipboard(selectedSnippet?.code)}>
              Copy Code
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
