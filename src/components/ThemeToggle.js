import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    setDarkMode(savedTheme);
    document.body.classList.toggle('bg-dark', savedTheme);
    document.body.classList.toggle('text-white', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.body.classList.toggle('bg-dark', newTheme);
    document.body.classList.toggle('text-white', newTheme);
  };

  return (
    <Button variant={darkMode ? "light" : "dark"} onClick={toggleTheme}>
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </Button>
  );
};

export default ThemeToggle;
