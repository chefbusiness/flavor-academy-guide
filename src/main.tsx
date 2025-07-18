
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SitemapGenerator } from './components/SitemapGenerator'
import './index.css'

// Generate sitemap on app load
const root = createRoot(document.getElementById("root")!);

root.render(
  <>
    <App />
    <SitemapGenerator />
  </>
);
