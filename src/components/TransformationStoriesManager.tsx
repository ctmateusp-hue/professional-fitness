import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FaPlus, FaTrash, FaSave, FaImage, FaPlay, FaStar, FaUser, FaUpload, FaLink } from 'react-icons/fa'
import { SupabaseService, TransformationStory, TransformationMedia } from '../lib/supabase'
import { toast } from 'sonner'

export function TransformationStoriesManager() {
  const [stories, setStories] = useState<TransformationStory[]>([])
  const [selectedStory, setSelectedStory] = useState<string>('')
  const [storyData, setStoryData] = useState({
    title: '',
    student_name: '',
    description: '',
    before_description: '',
    after_description: '',
    transformation_period: '',
    featured: false,
    sort_order: 0
  })
  const [mediaData, setMediaData] = useState({
    type: 'image' as 'image' | 'video',
    media_category: 'before' as 'before' | 'after' | 'before_after' | 'during' | 'video_testimonial',
    url: '',
    title: '',
    description: '',
    thumbnail: '',
    sort_order: 0
  })
  const [storyMedia, setStoryMedia] = useState<TransformationMedia[]>([])
  const [isEditingStory, setIsEditingStory] = useState(false)
  
  // Upload states
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  useEffect(() => {
    loadStories()
  }, [])

  useEffect(() => {
    if (selectedStory) {
      loadStoryMedia(selectedStory)
      loadStoryData(selectedStory)
    }
  }, [selectedStory])

  const loadStories = async () => {
    try {
      const data = await SupabaseService.getTransformationStories()
      setStories(data)
    } catch (error) {
      toast.error('Erro ao carregar histórias')
    }
  }

  const loadStoryData = async (storyId: string) => {
    try {
      const story = stories.find(s => s.id === storyId)
      if (story) {
        setStoryData({
          title: story.title,
          student_name: story.student_name,
          description: story.description,
          before_description: story.before_description || '',
          after_description: story.after_description || '',
          transformation_period: story.transformation_period || '',
          featured: story.featured,
          sort_order: story.sort_order
        })
      }
    } catch (error) {
      toast.error('Erro ao carregar dados da história')
    }
  }

  const loadStoryMedia = async (storyId: string) => {
    try {
      const data = await SupabaseService.getTransformationMedia(storyId)
      setStoryMedia(data)
    } catch (error) {
      toast.error('Erro ao carregar mídia da história')
    }
  }

  const handleCreateStory = async () => {
    try {
      await SupabaseService.createTransformationStory(storyData)
      toast.success('História criada com sucesso!')
      loadStories()
      resetStoryForm()
    } catch (error) {
      toast.error('Erro ao criar história')
    }
  }

  const handleUpdateStory = async () => {
    if (!selectedStory) return
    
    try {
      await SupabaseService.updateTransformationStory(selectedStory, storyData)
      toast.success('História atualizada com sucesso!')
      loadStories()
      setIsEditingStory(false)
    } catch (error) {
      toast.error('Erro ao atualizar história')
    }
  }

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta história?')) return
    
    try {
      await SupabaseService.deleteTransformationStory(storyId)
      toast.success('História excluída com sucesso!')
      loadStories()
      if (selectedStory === storyId) {
        setSelectedStory('')
        resetStoryForm()
      }
    } catch (error) {
      toast.error('Erro ao excluir história')
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      setUploadProgress('Verificando arquivo...')

      // Log file details
      console.log('📁 Upload details:', {
        fileName: file.name,
        fileType: file.type,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      })

      // Check file size limits
      const maxImageSize = 10 * 1024 * 1024 // 10MB for images
      const maxVideoSize = 100 * 1024 * 1024 // 100MB for videos
      
      if (mediaData.type === 'image' && file.size > maxImageSize) {
        toast.error('Imagem muito grande! Máximo 10MB permitido.')
        return
      }
      
      if (mediaData.type === 'video' && file.size > maxVideoSize) {
        toast.error('Vídeo muito grande! Máximo 100MB permitido.')
        return
      }

      // For videos, use URL instead of base64 to avoid timeout
      if (mediaData.type === 'video') {
        // Create a local URL for preview (temporary)
        const videoUrl = URL.createObjectURL(file)
        setMediaData({ ...mediaData, url: videoUrl })
        
        // Auto-fill title with filename if empty
        if (!mediaData.title) {
          setMediaData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }))
        }
        
        toast.success(`Vídeo ${file.name} carregado com sucesso!`)
        toast.info('⚠️ Para vídeos, recomendamos usar URL externa para melhor performance')
        return
      }

      // For images, convert to base64
      setUploadProgress('Processando imagem...')
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Url = e.target?.result as string
        setMediaData({ ...mediaData, url: base64Url })
        
        // Auto-fill title with filename if empty
        if (!mediaData.title) {
          setMediaData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }))
        }
        
        setUploadProgress('')
        toast.success(`Imagem ${file.name} carregada com sucesso!`)
      }
      reader.readAsDataURL(file)

    } catch (error) {
      console.error('❌ Erro no upload:', error)
      toast.error('Erro ao fazer upload do arquivo')
    } finally {
      setIsUploading(false)
      setUploadProgress('')
    }
  }

  const handleAddMedia = async () => {
    if (!selectedStory || !mediaData.url) return
    
    try {
      await SupabaseService.createTransformationMedia({
        story_id: selectedStory,
        ...mediaData
      })
      toast.success('Mídia adicionada com sucesso!')
      loadStoryMedia(selectedStory)
      resetMediaForm()
    } catch (error) {
      toast.error('Erro ao adicionar mídia')
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mídia?')) return
    
    try {
      await SupabaseService.deleteTransformationMedia(mediaId)
      toast.success('Mídia excluída com sucesso!')
      if (selectedStory) {
        loadStoryMedia(selectedStory)
      }
    } catch (error) {
      toast.error('Erro ao excluir mídia')
    }
  }

  const resetStoryForm = () => {
    setStoryData({
      title: '',
      student_name: '',
      description: '',
      before_description: '',
      after_description: '',
      transformation_period: '',
      featured: false,
      sort_order: 0
    })
    setIsEditingStory(false)
  }

  const resetMediaForm = () => {
    setMediaData({
      type: 'image',
      media_category: 'before',
      url: '',
      title: '',
      description: '',
      thumbnail: '',
      sort_order: 0
    })
    setUploadMethod('url')
    setUploadProgress('')
    setIsUploading(false)
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      before: 'Antes',
      after: 'Depois',
      before_after: 'Antes e Depois',
      during: 'Durante',
      video_testimonial: 'Vídeo Depoimento'
    }
    return labels[category as keyof typeof labels] || category
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Histórias de Transformação - "Faça como eles!"</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de História */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaUser size={20} />
              {isEditingStory ? 'Editar História' : 'Nova História'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título da História</Label>
                <Input
                  id="title"
                  value={storyData.title}
                  onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
                  placeholder="Ex: Transformação Incrível..."
                />
              </div>
              <div>
                <Label htmlFor="student_name">Nome do Aluno</Label>
                <Input
                  id="student_name"
                  value={storyData.student_name}
                  onChange={(e) => setStoryData({ ...storyData, student_name: e.target.value })}
                  placeholder="Nome do aluno"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição Geral</Label>
              <Textarea
                id="description"
                value={storyData.description}
                onChange={(e) => setStoryData({ ...storyData, description: e.target.value })}
                placeholder="Descrição geral da transformação..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="before_description">Situação Antes</Label>
                <Textarea
                  id="before_description"
                  value={storyData.before_description}
                  onChange={(e) => setStoryData({ ...storyData, before_description: e.target.value })}
                  placeholder="Como estava antes..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="after_description">Situação Depois</Label>
                <Textarea
                  id="after_description"
                  value={storyData.after_description}
                  onChange={(e) => setStoryData({ ...storyData, after_description: e.target.value })}
                  placeholder="Como ficou depois..."
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="transformation_period">Período</Label>
                <Input
                  id="transformation_period"
                  value={storyData.transformation_period}
                  onChange={(e) => setStoryData({ ...storyData, transformation_period: e.target.value })}
                  placeholder="Ex: 6 meses"
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Ordem</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={storyData.sort_order}
                  onChange={(e) => setStoryData({ ...storyData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={storyData.featured}
                  onChange={(e) => setStoryData({ ...storyData, featured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured" className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  Destaque
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditingStory ? (
                <>
                  <Button onClick={handleUpdateStory} className="flex-1">
                    <FaSave size={16} className="mr-2" />
                    Atualizar História
                  </Button>
                  <Button variant="outline" onClick={() => { resetStoryForm(); setIsEditingStory(false) }}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={handleCreateStory} className="flex-1">
                  <FaPlus size={16} className="mr-2" />
                  Criar História
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Histórias */}
        <Card>
          <CardHeader>
            <CardTitle>Histórias Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stories.map(story => (
                <div key={story.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold flex items-center gap-1">
                        {story.featured && <FaStar className="text-yellow-500" size={14} />}
                        {story.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{story.student_name}</p>
                      <p className="text-xs text-muted-foreground">{story.transformation_period}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStory(story.id)
                          setIsEditingStory(true)
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedStory(story.id)}
                      >
                        Mídia
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteStory(story.id)}
                      >
                        <FaTrash size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Mídia */}
      {selectedStory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaImage size={20} />
              Mídia da História: {stories.find(s => s.id === selectedStory)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulário de Mídia */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <Label htmlFor="media_type">Tipo</Label>
                <Select value={mediaData.type} onValueChange={(value: 'image' | 'video') => setMediaData({ ...mediaData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="media_category">Categoria</Label>
                <Select 
                  value={mediaData.media_category} 
                  onValueChange={(value: 'before' | 'after' | 'before_after' | 'during' | 'video_testimonial') => 
                    setMediaData({ ...mediaData, media_category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Antes</SelectItem>
                    <SelectItem value="after">Depois</SelectItem>
                    <SelectItem value="before_after">Antes e Depois</SelectItem>
                    <SelectItem value="during">Durante</SelectItem>
                    <SelectItem value="video_testimonial">Vídeo Depoimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Upload Method Selection */}
              <div>
                <Label>Método de Upload</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={uploadMethod === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUploadMethod('url')}
                    className="flex-1"
                  >
                    <FaLink size={14} className="mr-2" />
                    URL
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMethod === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUploadMethod('file')}
                    className="flex-1"
                  >
                    <FaUpload size={14} className="mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              {/* URL Input */}
              {uploadMethod === 'url' && (
                <div>
                  <Label htmlFor="media_url">URL</Label>
                  <Input
                    id="media_url"
                    value={mediaData.url}
                    onChange={(e) => setMediaData({ ...mediaData, url: e.target.value })}
                    placeholder="URL da imagem/vídeo"
                  />
                </div>
              )}

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div>
                  <Label htmlFor="media_file">Selecionar Arquivo</Label>
                  <div className="mt-2">
                    <Input
                      id="media_file"
                      type="file"
                      accept={mediaData.type === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleFileUpload(file)
                        }
                      }}
                      disabled={isUploading}
                      className="cursor-pointer"
                    />
                    {isUploading && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {uploadProgress || 'Processando...'}
                      </div>
                    )}
                    {mediaData.type === 'video' && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        ⚠️ Máximo 100MB. Para vídeos grandes, recomendamos usar URL externa (YouTube, Vimeo, etc.)
                      </p>
                    )}
                    {mediaData.type === 'image' && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        📸 Máximo 10MB. Formatos: JPG, PNG, WebP, GIF
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="media_title">Título</Label>
                <Input
                  id="media_title"
                  value={mediaData.title}
                  onChange={(e) => setMediaData({ ...mediaData, title: e.target.value })}
                  placeholder="Título da mídia"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddMedia} className="w-full">
                  <FaPlus size={16} className="mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Lista de Mídia */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storyMedia.map(media => (
                <div key={media.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {getCategoryLabel(media.media_category)}
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteMedia(media.id)}
                    >
                      <FaTrash size={12} />
                    </Button>
                  </div>
                  
                  {media.type === 'image' ? (
                    <img src={media.url} alt={media.title} className="w-full h-32 object-cover rounded mb-2" />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <FaPlay size={24} className="text-muted-foreground" />
                    </div>
                  )}
                  
                  {media.title && (
                    <p className="text-sm font-medium">{media.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{media.type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
