import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { FaTimes, FaPlay, FaImage, FaExternalLinkAlt, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Modality, MediaItem } from '../App'
import { SupabaseService } from '../lib/supabase'

interface GalleryProps {
  modality: Modality
  media: MediaItem[]
  onClose: () => void
}

export function Gallery({ modality, media, onClose }: GalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [supabaseMedia, setSupabaseMedia] = useState<MediaItem[]>([])

  // Load media from Supabase for this modality
  useEffect(() => {
    const loadSupabaseMedia = async () => {
      try {
        const mediaData = await SupabaseService.getMedia(modality.id, 'regular')
        const converted = mediaData.map(item => ({
          id: item.id,
          modalityId: item.modality_id,
          type: item.type,
          url: item.url,
          title: item.title,
          description: item.description,
          category: item.category as 'regular',
          thumbnail: item.thumbnail
        }))
        setSupabaseMedia(converted)
      } catch (error) {
        console.warn('Error loading media from Supabase:', error)
      }
    }
    
    loadSupabaseMedia()
  }, [modality.id])

  // Combine local and Supabase media
  const allAvailableMedia = [
    ...supabaseMedia,
    ...media.filter(local => 
      local.modalityId === modality.id && 
      !supabaseMedia.some(remote => remote.id === local.id)
    )
  ]

  const hasMedia = allAvailableMedia.length > 0
  const images = allAvailableMedia.filter(m => m.type === 'image')
  const videos = allAvailableMedia.filter(m => m.type === 'video')
  const allMedia = [...images, ...videos]

  // Update current index when selectedMedia changes
  useEffect(() => {
    if (selectedMedia) {
      const index = allMedia.findIndex(item => item.id === selectedMedia.id)
      setCurrentIndex(index)
    }
  }, [selectedMedia, allMedia])

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!selectedMedia) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedMedia(null)
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [selectedMedia])

  const goToPrevious = () => {
    if (allMedia.length === 0) return
    const newIndex = currentIndex > 0 ? currentIndex - 1 : allMedia.length - 1
    setSelectedMedia(allMedia[newIndex])
  }

  const goToNext = () => {
    if (allMedia.length === 0) return
    const newIndex = currentIndex < allMedia.length - 1 ? currentIndex + 1 : 0
    setSelectedMedia(allMedia[newIndex])
  }

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item)
  }

  const handleImageError = (mediaId: string) => {
    setImageErrors(prev => new Set(prev).add(mediaId))
  }

  const getVideoEmbedUrl = (url: string): string => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=0&rel=0`
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    // Direct video URL
    return url
  }

  const isDirectVideoUrl = (url: string): boolean => {
    return /\.(mp4|mov|avi|webm|ogg)$/i.test(url) || url.startsWith('blob:')
  }

  return (
    <section id="galeria" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-foreground mb-2">
              {modality.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              Veja nossa academia em ação
            </p>
            {hasMedia && (
              <div className="flex gap-4">
                <Badge variant="secondary" className="text-sm">
                  <FaImage size={14} className="mr-1" />
                  {images.length} fotos
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <FaPlay size={14} className="mr-1" />
                  {videos.length} vídeos
                </Badge>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            <FaTimes size={16} className="mr-2" />
            Fechar Galeria
          </Button>
        </div>
        
        {!hasMedia ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <FaImage size={32} className="text-muted-foreground" />
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
          <div className="space-y-8">
            {/* Images Section */}
            {images.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <FaImage size={24} />
                  Fotos Profissionais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {images.map((item) => (
                    <Card 
                      key={item.id}
                      className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => handleMediaClick(item)}
                    >
                      <CardContent className="p-0 relative aspect-square bg-muted">
                        {!imageErrors.has(item.id) ? (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={() => handleImageError(item.id)}
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <FaImage size={48} className="text-muted-foreground" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                            <FaEye size={16} className="text-gray-700" />
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white font-medium text-sm mb-1">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-white/80 text-xs overflow-hidden">
                              <span className="block truncate">
                                {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                              </span>
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {videos.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <FaPlay size={24} />
                  Vídeos de Treino
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((item) => (
                    <Card 
                      key={item.id}
                      className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => handleMediaClick(item)}
                    >
                      <CardContent className="p-0 relative aspect-video bg-black">
                        {item.thumbnail ? (
                          <div className="relative w-full h-full">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60" />
                        )}
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                            <FaPlay size={32} className="text-white ml-1" />
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white font-medium text-sm mb-1">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-white/80 text-xs overflow-hidden">
                              <span className="block truncate">
                                {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                              </span>
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <FaPlay size={12} className="text-white/60" />
                            <span className="text-white/60 text-xs">Clique para assistir</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
          >
            <FaTimes size={20} className="text-white" />
          </button>

          {/* Navigation buttons */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              >
                <FaChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              >
                <FaChevronRight size={20} className="text-white" />
              </button>
            </>
          )}

          {/* Media counter */}
          {allMedia.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">
                {currentIndex + 1} de {allMedia.length}
              </span>
            </div>
          )}

          {/* Media content */}
          <div className="max-w-[95vw] max-h-[95vh] flex items-center justify-center">
            {selectedMedia.type === 'image' ? (
              <div className="relative">
                {!imageErrors.has(selectedMedia.id) ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="max-w-full max-h-[90vh] object-contain"
                    onError={() => handleImageError(selectedMedia.id)}
                  />
                ) : (
                  <div className="w-96 h-96 flex items-center justify-center bg-gray-800 rounded-lg">
                    <div className="text-center text-white">
                      <FaImage size={64} className="mx-auto mb-4" />
                      <p>Erro ao carregar imagem</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-4xl aspect-video">
                {isDirectVideoUrl(selectedMedia.url) ? (
                  <video
                    controls
                    className="w-full h-full rounded-lg"
                    poster={selectedMedia.thumbnail}
                    autoPlay
                  >
                    <source src={selectedMedia.url} type="video/mp4" />
                    Seu navegador não suporta vídeo.
                  </video>
                ) : (
                  <iframe
                    src={getVideoEmbedUrl(selectedMedia.url)}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedMedia.title}
                  />
                )}
              </div>
            )}
          </div>

          {/* Media info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {selectedMedia.title}
                  </h3>
                  {selectedMedia.description && (
                    <p className="text-white/80 leading-relaxed">
                      {selectedMedia.description}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Badge variant={selectedMedia.type === 'image' ? 'default' : 'secondary'}>
                    {selectedMedia.type === 'image' ? (
                      <>
                        <FaImage size={14} className="mr-1" />
                        Foto
                      </>
                    ) : (
                      <>
                        <FaPlay size={14} className="mr-1" />
                        Vídeo
                      </>
                    )}
                  </Badge>
                  {!selectedMedia.url.startsWith('blob:') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(selectedMedia.url, '_blank')}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <FaExternalLinkAlt size={14} className="mr-1" />
                      Abrir Original
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
