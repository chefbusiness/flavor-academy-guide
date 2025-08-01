
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SitemapGenerator } from './components/SitemapGenerator'
import './index.css'

// Clean any migration state that might be causing infinite loops
import './utils/cleanMigrationState'

// Generate sitemap on app load
const root = createRoot(document.getElementById("root")!);

root.render(
  <>
    <App />
    <SitemapGenerator />
  </>
);
