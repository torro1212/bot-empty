import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './reset.css'
import './App.css'
import './index.css'
import './explicit-colors.css'
import { StagewiseToolbar } from '@stagewise/toolbar-react'

// Create main app root with theme class
const rootElement = document.getElementById("root")!;
// Add light theme class to ensure CSS variables are applied
document.documentElement.classList.add('light');

createRoot(rootElement).render(<App />);

// Initialize Stagewise toolbar in development mode only
if (import.meta.env.DEV) {
  const stagewiseConfig = {
    plugins: []
  };

  // Create a separate DOM element for the toolbar
  const toolbarContainer = document.createElement('div');
  toolbarContainer.id = 'stagewise-toolbar-container';
  document.body.appendChild(toolbarContainer);

  // Create a separate React root for the toolbar
  createRoot(toolbarContainer).render(
    <StagewiseToolbar config={stagewiseConfig} />
  );
}
