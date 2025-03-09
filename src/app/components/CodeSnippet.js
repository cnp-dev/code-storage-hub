import { Card, Button } from "react-bootstrap";

export default function CodeSnippet({ snippet }) {
  return (
    <Card className="mb-3">
      <Card.Header>{snippet.name} ({snippet.language})</Card.Header>
      <Card.Body>
        <pre><code>{snippet.code}</code></pre>
        <Button onClick={() => navigator.clipboard.writeText(snippet.code)}>Copy</Button>
      </Card.Body>
    </Card>
  );
}
