import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FaTimes, FaImage, FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa'
import { useState, useEffect, useMemo } from 'react'
import { MediaItem } from '../App'
import { SupabaseService, TransformationStory, TransformationMedia } from '../lib/supabase'

interface TransformationsProps {
  transformations: MediaItem[]
  onClose: () => void
}

export function Transformations({ transformations, onClose }: TransformationsProps) {
  console.log('🚀 Transformations component initialized with props:', { transformations: transformations.length })
  
  const [selectedTransformation, setSelectedTransformation] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [supabaseTransformations, setSupabaseTransformations] = useState<MediaItem[]>([])
  const [transformationStories, setTransformationStories] = useState<MediaItem[]>([])
  const [isLoadingTransformations, setIsLoadingTransformations] = useState(false)

  // Optimized transformations loading
  useEffect(() => {
    let isMounted = true

    const loadSupabaseTransformations = async () => {
      // Only load once
      if (supabaseTransformations.length > 0 && transformationStories.length > 0) return

      setIsLoadingTransformations(true)
      try {
        console.log('🔄 Loading transformations from Supabase...')
        
        // Load old media table transformations
        const media = await SupabaseService.getMedia(undefined, 'transformation')
        console.log('📊 Old media transformations:', media)
        
        // Load new transformation stories
        const stories = await SupabaseService.getTransformationStories()
        console.log('📚 Transformation stories:', stories)
        
        if (!isMounted) return

        // Convert old media format to App format
        const convertedMedia = media.map(item => ({
          id: item.id,
          modalityId: item.modality_slug, // Convert slug back to modalityId for compatibility
          type: item.type,
          url: item.url,
          title: item.title,
          description: item.description,
          category: item.category as 'transformation',
          thumbnail: item.thumbnail
        }))

        // Convert transformation stories to MediaItem format
        const convertedStories: MediaItem[] = []
        console.log(`🔄 Processing ${stories.length} transformation stories...`)
        
        for (const story of stories) {
          console.log(`📖 Processing story: ${story.title} (${story.id})`)
          
          // Get media for this story
          const storyMedia = await SupabaseService.getTransformationMedia(story.id)
          console.log(`🖼️ Found ${storyMedia.length} media items for story ${story.id}:`, storyMedia)
          
          // Convert each media item to MediaItem format
          for (const mediaItem of storyMedia) {
            const convertedItem = {
              id: `story-${story.id}-${mediaItem.id}`,
              modalityId: 'antes-depois', // Use a specific modality for transformation stories
              type: mediaItem.type,
              url: mediaItem.url,
              title: `${story.title} - ${mediaItem.media_category}`,
              description: story.description,
              category: 'transformation' as const,
              thumbnail: mediaItem.thumbnail
            }
            console.log(`✅ Converted media item:`, convertedItem)
            convertedStories.push(convertedItem)
          }
        }
        
        console.log('✅ Old transformations loaded:', convertedMedia)
        console.log('✅ Transformation stories loaded:', convertedStories)
        console.log('🎯 TOTAL TRANSFORMATIONS FOUND:', convertedMedia.length + convertedStories.length)
        
        setSupabaseTransformations(convertedMedia)
        setTransformationStories(convertedStories)
      } catch (error) {
        console.warn('Error loading transformations from Supabase:', error)
      } finally {
        if (isMounted) {
          setIsLoadingTransformations(false)
        }
      }
    }
    
    loadSupabaseTransformations()

    return () => {
      isMounted = false
    }
  }, []) // Only run once

  // Memoized transformations for better performance
  const allTransformations = useMemo(() => {
    const combined = [
      ...supabaseTransformations,
      ...transformationStories,
      ...transformations.filter(local => 
        !supabaseTransformations.some(remote => remote.id === local.id) &&
        !transformationStories.some(story => story.id === local.id)
      )
    ]
    
    // Add test data if no real data exists
    if (combined.length === 0) {
      console.log('⚠️ No transformation data found, adding test data for debugging')
      return [{
        id: 'test-transformation-1',
        modalityId: 'antes-depois',
        type: 'image' as const,
        url: 'https://via.placeholder.com/800x600/0000ff/ffffff?text=TESTE+ANTES+E+DEPOIS',
        title: 'Transformação Teste - João',
        description: 'Esta é uma transformação de teste para verificar se o sistema está funcionando',
        category: 'transformation' as const,
        thumbnail: undefined
      }]
    }
    
    return combined
  }, [supabaseTransformations, transformationStories, transformations])

  const hasTransformations = allTransformations.length > 0

  // Update current index when selectedTransformation changes
  useEffect(() => {
    if (selectedTransformation) {
      const index = allTransformations.findIndex(item => item.id === selectedTransformation.id)
      setCurrentIndex(index)
    }
  }, [selectedTransformation, allTransformations])

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!selectedTransformation) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedTransformation(null)
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [selectedTransformation])

  const goToPrevious = () => {
    if (allTransformations.length === 0) return
    const newIndex = currentIndex > 0 ? currentIndex - 1 : allTransformations.length - 1
    setSelectedTransformation(allTransformations[newIndex])
  }

  const goToNext = () => {
    if (allTransformations.length === 0) return
    const newIndex = currentIndex < allTransformations.length - 1 ? currentIndex + 1 : 0
    setSelectedTransformation(allTransformations[newIndex])
  }

  const handleImageError = (mediaId: string) => {
    setImageErrors(prev => new Set(prev).add(mediaId))
  }

  const handleTransformationClick = (item: MediaItem) => {
    setSelectedTransformation(item)
  }

  // Debug log before rendering
  console.log('🎨 RENDERING Transformations component:', {
    supabaseTransformations: supabaseTransformations.length,
    transformationStories: transformationStories.length,
    allTransformations: allTransformations.length,
    hasTransformations,
    isLoadingTransformations
  })

  return (
    <section className="py-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-foreground mb-2">
              Faça como eles! 💪
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              Histórias reais de transformação dos nossos alunos
            </p>
            {hasTransformations && (
              <div className="flex gap-4">
                <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  <FaImage size={14} className="mr-1 inline" />
                  {allTransformations.length} transformações
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            <FaTimes size={16} className="mr-2" />
            Voltar
          </Button>
        </div>
        
        {isLoadingTransformations ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando transformações...</p>
          </div>
        ) : !hasTransformations ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <FaImage size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Transformações em breve
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Estamos coletando as melhores histórias de transformação dos nossos alunos. 
              Volte em breve para se inspirar!
            </p>
            <Button className="bg-accent hover:bg-accent/90">
              Entre em Contato
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allTransformations.map((item) => (
              <Card 
                key={item.id}
                className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                onClick={() => handleTransformationClick(item)}
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
        )}
      </div>
      
      {/* Fullscreen viewer */}
      {selectedTransformation && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setSelectedTransformation(null)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
          >
            <FaTimes size={20} className="text-white" />
          </button>

          {/* Navigation buttons */}
          {allTransformations.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              >
                <FaArrowLeft size={20} className="text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              >
                <FaArrowRight size={20} className="text-white" />
              </button>
            </>
          )}

          {/* Media counter */}
          {allTransformations.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">
                {currentIndex + 1} de {allTransformations.length}
              </span>
            </div>
          )}

          {/* Image content */}
          <div className="max-w-[95vw] max-h-[95vh] flex items-center justify-center">
            <div className="relative">
              {!imageErrors.has(selectedTransformation.id) ? (
                <img
                  src={selectedTransformation.url}
                  alt={selectedTransformation.title}
                  className="max-w-full max-h-[90vh] object-contain"
                  onError={() => handleImageError(selectedTransformation.id)}
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
          </div>

          {/* Image info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {selectedTransformation.title}
                  </h3>
                  {selectedTransformation.description && (
                    <p className="text-white/80 leading-relaxed">
                      {selectedTransformation.description}
                    </p>
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
