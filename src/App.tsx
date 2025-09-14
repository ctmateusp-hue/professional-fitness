import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ModalityCards } from './components/ModalityCards'
import { Gallery } from './components/Gallery'
import { Transformations } from './components/Transformations'
import { Pricing } from './components/Pricing'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { AdminPanel } from './components/AdminPanel'
import { AdminLogin } from './components/AdminLogin'
import { Toaster } from '@/components/ui/sonner'
import { usePersistentStorage } from './lib/storage'
import { SupabaseService } from './lib/supabase'
import whatsappIcon from './assets/whatsapp.png'

const WHATSAPP_LINK = "https://wa.me/5517988275111?text=Quero%20agendar%20uma%20aula%20experimental";

export type Modality = {
  id: string
  title: string
  description: string
  image?: string
}

export type MediaItem = {
  id: string
  modalityId: string
  type: 'image' | 'video'
  url: string
  title: string
  description?: string
  thumbnail?: string
  category?: 'transformation' | 'regular' // Nova categoria para transformações
}

const defaultModalities: Modality[] = [
  {
    id: 'functional',
    title: 'FUNCIONAL/CROSS',
    description: 'Nossos treinos são elaborados com uma metodologia própria. Voltado para as pessoas da nossa cidade. São exercícios que usam bastante o peso corporal associados com aparelhos de musculação.'
  },
  {
    id: 'musculacao',
    title: 'MUSCULAÇÃO',
    description: 'Treinos elaborados com exercícios de resultado, ou seja, focando no que o corpo mais precisa, tanto para estética, fortalecimento, ganho de massa….etc.'
  },
  {
    id: 'zumba',
    title: 'ZUMBA',
    description: 'Aula de dança com as melhores e mais animadas músicas! Coreografias adaptadas para você aproveitar o máximo a aula!'
  }
]

function App() {
  // Initialize currentView based on current URL
  const getInitialView = (): 'home' | 'admin' | 'transformations' => {
    const hash = window.location.hash
    const pathname = window.location.pathname
    
    if (pathname === '/admin' || pathname.endsWith('/admin') || hash === '#/admin' || hash === '#admin') {
      return 'admin'
    } else if (hash === '#/transformations' || hash === '#transformations') {
      return 'transformations'
    }
    return 'home'
  }
  
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'transformations'>(getInitialView())
  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  
  // Use persistent storage
  const { data, loadData, saveData, isLoading } = usePersistentStorage()
  const { media, modalities } = data

  const selectedModality = modalities?.find(m => m.id === selectedModalityId)
  
  // Filter transformations from media
  const transformations = media?.filter(item => item.category === 'transformation') || []
  const regularMedia = media?.filter(item => item.category !== 'transformation') || []
  
  // Check for admin route in URL hash and path
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash
      const pathname = window.location.pathname
      
      // If someone accesses /admin directly, redirect to /#/admin
      if (pathname === '/admin' || pathname.endsWith('/admin')) {
        window.location.replace(window.location.origin + '/#/admin')
        return
      }
      
      // Only handle specific app routes, don't interfere with anchor navigation
      if (hash === '#/admin' || hash === '#admin') {
        setCurrentView('admin')
      } else if (hash === '#/transformations' || hash === '#transformations') {
        setCurrentView('transformations')
      }
      // Let all other hashes (#modalidades, #galeria, etc.) work normally for anchor navigation
    }
    
    // Check on load
    checkAdminRoute()
    
    // Listen for hash changes only for our specific routes
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#/admin' || hash === '#admin' || hash === '#/transformations' || hash === '#transformations') {
        checkAdminRoute()
      }
    }
    
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])
  
  // Simplified data loading - only load local data, sync in background
  useEffect(() => {
    const simpleLoadData = async () => {
      try {
        // Fast load from localStorage only
        await loadData()
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    
    simpleLoadData()
  }, [])

  const handleShowTransformations = () => {
    setCurrentView('transformations')
    setSelectedModalityId(null)
  }

  const handleBackFromTransformations = () => {
    setCurrentView('home')
    setSelectedModalityId(null)
  }

  const handleDataUpdate = async (newData: { media: MediaItem[], modalities: Modality[] }) => {
    await saveData(newData)
  }

  const handleAddMedia = async (newMedia: MediaItem) => {
    const updatedMedia = [...(media || []), newMedia]
    await saveData({ media: updatedMedia, modalities: modalities || [] })
    await loadData() // Reload to get fresh data
  }

  const handleDeleteMedia = async (mediaId: string) => {
    const updatedMedia = (media || []).filter(m => m.id !== mediaId)
    await saveData({ media: updatedMedia, modalities: modalities || [] })
    await loadData() // Reload to get fresh data
  }

  if (isLoading && currentView === 'home') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
    }
    
    return (
      <div className="min-h-screen bg-background">
        <AdminPanel 
          onBack={() => {
            setCurrentView('home')
            setIsAdminAuthenticated(false) // Logout when going back
          }}
          modalities={modalities || []}
          media={media || []}
          onAddMedia={handleAddMedia}
          onDeleteMedia={handleDeleteMedia}
        />
        <Toaster />
      </div>
    )
  }

  if (currentView === 'transformations') {
    return (
      <div className="min-h-screen bg-background">
        <Transformations 
          transformations={transformations}
          onClose={handleBackFromTransformations}
        />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero onShowTransformations={handleShowTransformations} />
        <ModalityCards 
          modalities={modalities || []}
          onModalityClick={setSelectedModalityId}
          media={regularMedia || []}
        />
        {selectedModality && (
          <Gallery 
            modality={selectedModality}
            media={(regularMedia || []).filter(m => m.modalityId === selectedModality.id)}
            onClose={() => setSelectedModalityId(null)}
          />
        )}
        <Pricing />
        <Contact />
      </main>
      
      {/* Botão flutuante do WhatsApp */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-green-500 text-white p-3 shadow-lg hover:bg-green-600 transition-colors duration-200 hover:shadow-xl"
        aria-label="Abrir WhatsApp"
      >
        <img 
          src={whatsappIcon} 
          alt="WhatsApp" 
          className="w-8 h-8"
        />
      </a>
      
      <Footer />
      <Toaster />
    </div>
  )
}

export default App