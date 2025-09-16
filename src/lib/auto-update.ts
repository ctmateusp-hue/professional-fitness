// Auto-update system for cache busting
const CURRENT_VERSION = import.meta.env.VITE_APP_VERSION ?? 'dev'

let updateCheckInProgress = false

async function checkForUpdate() {
  if (updateCheckInProgress) return
  updateCheckInProgress = true
  
  try {
    const response = await fetch('/version.txt', { 
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
    const latestVersion = (await response.text()).trim()
    
    if (latestVersion && latestVersion !== CURRENT_VERSION) {
      console.log('🔄 New version detected:', latestVersion, 'current:', CURRENT_VERSION)
      
      // Show a nice notification before reloading
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Professional Fitness', {
          body: 'Nova versão disponível! Atualizando...',
          icon: '/favicon.ico'
        })
      }
      
      // Wait a bit then reload
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    console.warn('⚠️ Update check failed:', error)
  } finally {
    updateCheckInProgress = false
  }
}

// Check every 2 minutes
setInterval(checkForUpdate, 120000)

// Check when window gets focus
window.addEventListener('focus', checkForUpdate)

// Check when page becomes visible (mobile)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    checkForUpdate()
  }
})

// Initial check after 10 seconds
setTimeout(checkForUpdate, 10000)

export { checkForUpdate }