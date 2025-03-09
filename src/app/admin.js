import { useState, useEffect } from 'react';
import axios from 'axios';
import CodeSnippet from './components/CodeSnippet';
import { Form, Button, Container } from 'react-bootstrap';

export default function Admin() {
  const [snippets, setSnippets] = useState([]);
  const [form, setForm] = useState({ name: "", language: "", code: "" });

  useEffect(() => {
    axios.get('/api/snippets').then(res => setSnippets(res.data));
  }, []);

  const addSnippet = async () => {
    const res = await axios.post('/api/snippets', { ...form, userRole: "admin" });
    setSnippets([...snippets, res.data]);
  };

  const deleteSnippet = async (id) => {
    await axios.delete('/api/snippets', { data: { id, userRole: "admin" } });
    setSnippets(snippets.filter(s => s._id !== id));
  };

  return (
    <Container className="mt-4">
      <h1>Admin Panel</h1>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Snippet Name</Form.Label>
          <Form.Control type="text" onChange={e => setForm({ ...form, name: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Language</Form.Label>
          <Form.Control type="text" onChange={e => setForm({ ...form, language: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Code</Form.Label>
          <Form.Control as="textarea" rows={4} onChange={e => setForm({ ...form, code: e.target.value })} />
        </Form.Group>
        <Button variant="primary" onClick={addSnippet}>Add Snippet</Button>
      </Form>

      <div className="mt-4">
        {snippets.map(snippet => (
          <div key={snippet._id} className="mb-3">
            <CodeSnippet snippet={snippet} />
            <Button variant="danger" onClick={() => deleteSnippet(snippet._id)}>Delete</Button>
          </div>
        ))}
      </div>
    </Container>
  );
}
