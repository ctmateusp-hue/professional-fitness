import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaBolt, FaDumbbell, FaMusic, FaArrowRight } from 'react-icons/fa'
import { Modality, MediaItem } from '../App'

interface ModalityCardsProps {
  modalities: Modality[]
  onModalityClick: (modalityId: string) => void
  media?: MediaItem[]
}

const modalityIcons = {
  functional: FaBolt,
  musculacao: FaDumbbell,
  zumba: FaMusic
}

const modalityColors = {
  functional: 'from-accent/20 to-accent/5',
  musculacao: 'from-primary/20 to-primary/5',
  zumba: 'from-pink-500/20 to-pink-500/5'
}

export function ModalityCards({ modalities, onModalityClick, media = [] }: ModalityCardsProps) {
  return (
    <section id="modalidades" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-4">
            Nossas Modalidades
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o treino ideal para seus objetivos. Metodologias comprovadas 
            com acompanhamento profissional.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {modalities.map((modality) => {
            const IconComponent = modalityIcons[modality.id as keyof typeof modalityIcons] || FaBolt
            const colorClass = modalityColors[modality.id as keyof typeof modalityColors] || modalityColors.functional
            const modalityMediaCount = media.filter(m => m.modalityId === modality.id).length
            
            return (
              <Card 
                key={modality.id} 
                data-modality-id={modality.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col"
              >
                <div className={`h-2 bg-gradient-to-r ${colorClass.replace('/20', '').replace('/5', '')}`}></div>
                
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent size={32} className="text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {modality.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                    {modality.description}
                  </p>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold mt-auto"
                    size="lg"
                    onClick={() => onModalityClick(modality.id)}
                  >
                    Ver Galeria ({modalityMediaCount} {modalityMediaCount === 1 ? 'item' : 'itens'})
                    <FaArrowRight 
                      size={16} 
                      className="ml-2 group-hover/btn:translate-x-1 transition-transform" 
                    />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}