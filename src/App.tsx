import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ModalityCards } from './components/ModalityCards'
import { Gallery } from './components/Gallery'
import { Pricing } from './components/Pricing'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { AdminPanel } from './components/AdminPanel'
import { Toaster } from '@/components/ui/sonner'
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
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home')
  const [isAdmin, setIsAdmin] = useState(false)
  const [modalities] = useKV<Modality[]>('gym-modalities', defaultModalities)
  const [media] = useKV<MediaItem[]>('gym-media', [])
  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(null)

  const selectedModality = modalities?.find(m => m.id === selectedModalityId)

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <AdminPanel 
          onBack={() => setCurrentView('home')}
          modalities={modalities || []}
        />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAdminClick={() => setCurrentView('admin')}
        isAdmin={isAdmin}
        onAdminLogin={() => setIsAdmin(true)}
      />
      
      <main>
        <Hero />
        <ModalityCards 
          modalities={modalities || []}
          onModalityClick={setSelectedModalityId}
        />
        {selectedModality && (
          <Gallery 
            modality={selectedModality}
            media={(media || []).filter(m => m.modalityId === selectedModality.id)}
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