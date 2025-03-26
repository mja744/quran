
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add a timeout option to the fetch API
const originalFetch = window.fetch;
window.fetch = function(resource, options = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);
  
  return originalFetch(resource, { ...options, signal })
    .finally(() => clearTimeout(timeoutId));
};

createRoot(document.getElementById("root")!).render(<App />);
