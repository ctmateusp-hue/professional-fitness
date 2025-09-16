import { useState, useEffect } from 'react'

interface AdminSession {
  isAuthenticated: boolean
  loginTime: number
  expiresAt: number
}

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 horas em milissegundos
const SESSION_KEY = 'admin_session'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se existe sessão válida ao carregar
  useEffect(() => {
    checkExistingSession()
  }, [])

  const checkExistingSession = () => {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY)
      if (sessionData) {
        const session: AdminSession = JSON.parse(sessionData)
        const now = Date.now()
        
        // Verificar se a sessão ainda é válida
        if (session.isAuthenticated && now < session.expiresAt) {
          setIsAuthenticated(true)
          console.log('✅ Sessão admin válida encontrada')
        } else {
          // Sessão expirada, limpar
          localStorage.removeItem(SESSION_KEY)
          console.log('❌ Sessão admin expirada, removendo')
        }
      }
    } catch (error) {
      console.error('Erro ao verificar sessão admin:', error)
      localStorage.removeItem(SESSION_KEY)
    } finally {
      setIsLoading(false)
    }
  }

  const login = () => {
    const now = Date.now()
    const session: AdminSession = {
      isAuthenticated: true,
      loginTime: now,
      expiresAt: now + SESSION_DURATION
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setIsAuthenticated(true)
    console.log('✅ Login admin realizado - sessão válida por 24h')
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setIsAuthenticated(false)
    console.log('❌ Logout admin realizado')
  }

  const extendSession = () => {
    if (isAuthenticated) {
      const now = Date.now()
      const session: AdminSession = {
        isAuthenticated: true,
        loginTime: now,
        expiresAt: now + SESSION_DURATION
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      console.log('🔄 Sessão admin estendida por mais 24h')
    }
  }

  // Auto-extend session on activity (opcional)
  useEffect(() => {
    if (!isAuthenticated) return

    const handleActivity = () => {
      extendSession()
    }

    // Estender sessão a cada 30 minutos de atividade
    const interval = setInterval(() => {
      if (document.hasFocus()) {
        extendSession()
      }
    }, 30 * 60 * 1000) // 30 minutos

    // Adicionar listeners para atividade do usuário
    window.addEventListener('click', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('scroll', handleActivity)

    return () => {
      clearInterval(interval)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity)
    }
  }, [isAuthenticated])

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    extendSession
  }
}