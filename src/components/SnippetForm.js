"use client";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SnippetForm({ fetchSnippets }) {
  const [newSnippet, setNewSnippet] = useState({ name: "", language: "", code: "" });

  const addSnippet = async () => {
    if (!newSnippet.name || !newSnippet.language || !newSnippet.code) {
      toast.error("Please fill all fields!", { autoClose: 2000 });
      return;
    }
    try {
      await axios.post("/api/snippets", newSnippet);
      setNewSnippet({ name: "", language: "", code: "" }); // Reset form
      fetchSnippets(); // Refresh snippet list
      toast.success("Snippet added successfully!", { autoClose: 2000 });
    } catch (error) {
      console.error("Error adding snippet:", error);
      toast.error("Failed to add snippet!", { autoClose: 2000 });
    }
  };

  return (
    <>
      <ToastContainer />
      <Form className="mt-4">
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
    </>
  );
}
