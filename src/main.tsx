
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add a timeout feature to fetch requests via AbortController
const originalFetch = window.fetch;
window.fetch = function(resource, options = {}) {
  // Create a new options object without the timeout property
  const { timeout, ...standardOptions } = options as { timeout?: number } & RequestInit;
  
  // Set up abort controller for timeout
  const controller = new AbortController();
  const timeoutDuration = timeout || 10000; // Default timeout of 10 seconds
  
  // Merge the signal if one already exists
  const signal = options.signal || controller.signal;
  
  // Set timeout to abort the fetch
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
  
  return originalFetch(resource, { ...standardOptions, signal })
    .finally(() => clearTimeout(timeoutId));
};

createRoot(document.getElementById("root")!).render(<App />);
