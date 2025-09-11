import { createRoot } from 'react-dom/client'

// Teste simples sem ErrorBoundary
function SimpleApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Academia Professional Fitness - Teste</h1>
      <p>Se você vê esta mensagem, o React está funcionando!</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<SimpleApp />)
