import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from '@/components/ui/sonner'; // ✅ use alias path if set, or use relative path

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
      <Toaster position="top-center" richColors />
  </StrictMode>
);
