import { useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ModalityCards } from './components/ModalityCards'
import { Gallery } from './components/Gallery'
import { Pricing } from './components/Pricing'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

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
  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(null)
  const modalities = defaultModalities
  const media: MediaItem[] = []

  const selectedModality = modalities?.find(m => m.id === selectedModalityId)

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAdminClick={() => console.log('Admin clicked')}
        isAdmin={false}
        onAdminLogin={() => console.log('Admin login')}
      />
      
      <main>
        <Hero />
        <ModalityCards 
          modalities={modalities}
          onModalityClick={(modalityId) => setSelectedModalityId(modalityId)}
        />
        <Pricing />
        <Contact />
      </main>
      
      <Footer />
      
      {selectedModality && (
        <Gallery
          modality={selectedModality}
          media={media.filter(m => m.modalityId === selectedModality.id)}
          onClose={() => setSelectedModalityId(null)}
        />
      )}
    </div>
  )
}

export default App
