import "./App.css";
import Dino from "./components/Dino/Dino";

import React, { useState, useEffect } from 'react';

function App() {
  // Inside your component function, alongside your existing states:
const [isDucking, setIsDucking] = useState(false);

useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 's') {
      setIsDucking(true);
    }
  };
  const handleKeyUp = (e) => {
    if (e.key === 'ArrowDown' || e.key === 's') {
      setIsDucking(false);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, []);
  return (
    <div className="App">
      <Dino />
    </div>
  );
}

export default App;
