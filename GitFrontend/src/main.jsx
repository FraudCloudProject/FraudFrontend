import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { useState } from "react";

function App() {
  return (
    <>
      <div className="bg-red-700">
        Hello
      </div>
    </>
  );
}

export default App;


createRoot(document.getElementById('root')).render(
    <App />
)
