import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { X, Play, Image as ImageIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Modality, MediaItem } from '../App'

interface GalleryProps {
  modality: Modality
  media: MediaItem[]
  onClose: () => void
}

export function Gallery({ modality, media, onClose }: GalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  const hasMedia = media.length > 0

  return (
    <section id="galeria" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-foreground mb-2">
              {modality.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              Veja nossa academia em ação
            </p>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X size={16} className="mr-2" />
            Fechar
          </Button>
        </div>
        
        {!hasMedia ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Galeria em breve
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Estamos preparando fotos e vídeos incríveis desta modalidade. 
              Volte em breve para ver o conteúdo!
            </p>
            <Button className="bg-accent hover:bg-accent/90">
              Entre em Contato
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {media.map((item) => (
              <Card 
                key={item.id}
                className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => setSelectedMedia(item)}
              >
                <CardContent className="p-0 relative aspect-square bg-muted">
                  {item.type === 'video' ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                      <Play size={48} className="text-primary-foreground" weight="fill" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon size={48} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-medium text-sm">
                      {item.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {selectedMedia && (
        <Dialog open={true} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-4xl">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              {selectedMedia.type === 'video' ? (
                <div className="text-white">
                  <Play size={64} className="mb-4" />
                  <p>Vídeo: {selectedMedia.title}</p>
                </div>
              ) : (
                <div className="text-white">
                  <ImageIcon size={64} className="mb-4" />
                  <p>Imagem: {selectedMedia.title}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}