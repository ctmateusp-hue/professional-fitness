import { createRoot } from 'react-dom/client'

// Teste simples para verificar se o React funciona
function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>CT MATEUS PAVANELLO - Teste de Funcionalidade</h1>
      <p style={{ color: '#666', textAlign: 'center', maxWidth: '600px' }}>
        Se você consegue ver esta mensagem, o React está funcionando corretamente. 
        O problema pode estar nas dependências do GitHub Spark ou nos hooks personalizados.
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '10px 20px', 
        backgroundColor: '#4CAF50', 
        color: 'white', 
        borderRadius: '5px' 
      }}>
        ✅ React funcionando!
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<TestApp />)
