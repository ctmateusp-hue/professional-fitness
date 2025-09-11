import { createRoot } from 'react-dom/client'
import App from './App'
import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Simple error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return children;
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} else {
  console.error('Root element not found');
}
