import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { MediaItem } from '../App'
import { Database, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'

const sampleGymMedia: MediaItem[] = [
  // Functional/Cross Training
  {
    id: 'sample-func-1',
    modalityId: 'functional',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    title: 'Treino Funcional em Circuito',
    description: 'Exercícios funcionais utilizando peso corporal e equipamentos para desenvolver força, coordenação e resistência cardiovascular.'
  },
  {
    id: 'sample-func-2',
    modalityId: 'functional',
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80',
    title: 'Cross Training com Equipamentos',
    description: 'Treino intenso combinando movimentos olímpicos, ginásticos e de condicionamento metabólico.'
  },
  {
    id: 'sample-func-3',
    modalityId: 'functional',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=UBMk30rjy0o',
    title: 'Circuito Funcional Completo',
    description: 'Demonstração de um circuito funcional de 20 minutos com exercícios variados para todos os níveis.',
    thumbnail: 'https://img.youtube.com/vi/UBMk30rjy0o/maxresdefault.jpg'
  },
  
  // Musculação
  {
    id: 'sample-musc-1',
    modalityId: 'musculacao',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
    title: 'Área de Musculação Completa',
    description: 'Equipamentos modernos de musculação com foco em treinos de hipertrofia e fortalecimento muscular.'
  },
  {
    id: 'sample-musc-2',
    modalityId: 'musculacao',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
    title: 'Técnica de Execução Perfeita',
    description: 'Demonstração da forma correta de execução dos exercícios com acompanhamento profissional.'
  },
  {
    id: 'sample-musc-3',
    modalityId: 'musculacao',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=SwIOSpTwJck',
    title: 'Técnicas de Musculação Avançada',
    description: 'Vídeo explicativo sobre técnicas avançadas de musculação para maximizar os resultados do treino.',
    thumbnail: 'https://img.youtube.com/vi/SwIOSpTwJck/maxresdefault.jpg'
  },

  // Zumba
  {
    id: 'sample-zumba-1',
    modalityId: 'zumba',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    title: 'Aula de Zumba Energética',
    description: 'Turma animada de Zumba com coreografias dinâmicas e músicas contagiantes que fazem você se divertir enquanto queima calorias.'
  },
  {
    id: 'sample-zumba-2',
    modalityId: 'zumba',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    title: 'Coreografia Latina Moderna',
    description: 'Movimentos inspirados em danças latinas adaptados para todos os níveis de condicionamento físico.'
  },
  {
    id: 'sample-zumba-3',
    modalityId: 'zumba',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=oe7gUhwlcOg',
    title: 'Zumba Fitness - Aula Completa',
    description: 'Aula completa de Zumba com 45 minutos de muita dança, diversão e queima de calorias.',
    thumbnail: 'https://img.youtube.com/vi/oe7gUhwlcOg/maxresdefault.jpg'
  }
]

interface SampleContentProps {
  className?: string
}

export function SampleContent({ className }: SampleContentProps) {
  const [media, setMedia] = useKV<MediaItem[]>('gym-media', [])

  const addSampleContent = () => {
    // Filter out content that already exists
    const existingIds = new Set(media.map(m => m.id))
    const newContent = sampleGymMedia.filter(item => !existingIds.has(item.id))
    
    if (newContent.length === 0) {
      toast.info('Conteúdo de exemplo já foi adicionado!')
      return
    }

    setMedia((current) => [...current, ...newContent])
    toast.success(`${newContent.length} itens de exemplo adicionados com sucesso!`)
  }

  const clearAllContent = () => {
    setMedia([])
    toast.success('Toda a mídia foi removida!')
  }

  const existingIds = new Set(media.map(m => m.id))
  const hasAllSamples = sampleGymMedia.every(item => existingIds.has(item.id))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database size={20} />
          Conteúdo de Demonstração
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="mb-3">
            Para demonstrar as funcionalidades da galeria, você pode adicionar conteúdo profissional de exemplo:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Funcional</Badge>
              <span className="text-xs">3 itens</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Musculação</Badge>
              <span className="text-xs">3 itens</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Zumba</Badge>
              <span className="text-xs">3 itens</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={addSampleContent} 
            disabled={hasAllSamples}
            className="flex-1"
          >
            <Download size={16} className="mr-2" />
            {hasAllSamples ? 'Já Adicionado' : 'Adicionar Exemplos'}
          </Button>
          
          {media.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearAllContent}
              className="text-destructive hover:text-destructive"
            >
              Limpar Tudo
            </Button>
          )}
        </div>
        
        {hasAllSamples && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            ✓ Todo o conteúdo de exemplo já foi adicionado. Você pode visualizar na galeria clicando nas modalidades na página inicial.
          </div>
        )}
      </CardContent>
    </Card>
  )
}