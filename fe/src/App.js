import React from 'react';
import './App.css';
import Home from "./components/Home";
import { PactStore } from "./contexts/PactContext";

function App() {
  return (
    <PactStore>
      <Home />
    </PactStore>
  );
}

export default App;
