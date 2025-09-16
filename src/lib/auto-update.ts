// Auto-update system for cache busting
const CURRENT_VERSION = import.meta.env.VITE_APP_VERSION ?? 'dev'

let updateCheckInProgress = false
let lastCheckedVersion = ''

async function checkForUpdate() {
  // Only check if not in dev mode and not already checking
  if (import.meta.env.DEV || updateCheckInProgress) return
  updateCheckInProgress = true
  
  try {
    const response = await fetch('/version.txt', { 
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
    const latestVersion = (await response.text()).trim()
    
    // Only proceed if we got a valid version and it's different from what we last checked
    if (latestVersion && latestVersion !== lastCheckedVersion && latestVersion !== CURRENT_VERSION) {
      console.log('🔄 New version detected:', latestVersion, 'current:', CURRENT_VERSION)
      lastCheckedVersion = latestVersion
      
      // Wait longer before reloading to avoid constant refreshes on mobile
      setTimeout(() => {
        // Check if user is actively using the site
        if (document.visibilityState === 'visible' && !document.hidden) {
          console.log('🔄 Reloading to update...')
          window.location.reload()
        }
      }, 5000) // Wait 5 seconds
    }
  } catch (error) {
    console.warn('⚠️ Update check failed:', error)
  } finally {
    updateCheckInProgress = false
  }
}

// Check every 5 minutes instead of 2 (less aggressive)
setInterval(checkForUpdate, 300000)

// Check when window gets focus (but only if hidden for more than 1 minute)
let lastFocusTime = Date.now()
window.addEventListener('focus', () => {
  const now = Date.now()
  if (now - lastFocusTime > 60000) { // Only if was away for more than 1 minute
    setTimeout(checkForUpdate, 2000) // Wait 2 seconds after focus
  }
  lastFocusTime = now
})

// Check when page becomes visible (mobile) - less aggressive
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && Date.now() - lastFocusTime > 60000) {
    setTimeout(checkForUpdate, 3000) // Wait 3 seconds
  }
})

// Initial check after 30 seconds instead of 10
setTimeout(checkForUpdate, 30000)

export { checkForUpdate }