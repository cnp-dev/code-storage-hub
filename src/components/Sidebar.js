import Link from 'next/link';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-dark text-white vh-100" style={{ width: "250px", position: "fixed" }}>
      <h2>Code Storage Hub</h2>
      <Nav className="flex-column mt-4">
        <Nav.Link href="/" className="text-white">Home</Nav.Link>
        <Nav.Link href="/admin" className="text-white">Admin Panel</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
