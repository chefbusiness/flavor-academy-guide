
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SitemapGenerator } from './components/SitemapGenerator'
import './index.css'

// Import and execute image migration automatically
import './utils/executeRealMigration'

// Generate sitemap on app load
const root = createRoot(document.getElementById("root")!);

root.render(
  <>
    <App />
    <SitemapGenerator />
  </>
);
