import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FaArrowLeft, FaUpload, FaTrash, FaPlus, FaSave, FaImage, FaPlay, FaLink, FaFile, FaUsers, FaSignOutAlt, FaStar, FaDumbbell } from 'react-icons/fa'
import { Modality, MediaItem } from '../App'
import { TransformationStoriesManager } from './TransformationStoriesManager'
import { toast } from 'sonner'
import { usePersistentStorage } from '../lib/storage'
import { SupabaseService } from '@/lib/supabase'

interface AdminPanelProps {
  modalities: Modality[]
  media: MediaItem[]
  onAddMedia: (media: MediaItem) => void
  onDeleteMedia: (id: string) => void
  onBack: () => void
  onLogout?: () => void
}

export function AdminPanel({ modalities, media, onAddMedia, onDeleteMedia, onBack, onLogout }: AdminPanelProps) {
  const [selectedModalityId, setSelectedModalityId] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaTitle, setMediaTitle] = useState('')
  const [mediaDescription, setMediaDescription] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    try {
      console.log('📁 File info:', { 
        name: file.name, 
        size: file.size, 
        type: file.type,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      })

      // Check file size limits
      const maxImageSize = 10 * 1024 * 1024 // 10MB for images
      const maxVideoSize = 100 * 1024 * 1024 // 100MB for videos
      
      if (mediaType === 'image' && file.size > maxImageSize) {
        toast.error('Imagem muito grande! Máximo 10MB permitido.')
        return
      }
      
      if (mediaType === 'video' && file.size > maxVideoSize) {
        toast.error('Vídeo muito grande! Máximo 100MB permitido.')
        return
      }

      // For videos, use URL instead of base64 to avoid timeout
      if (mediaType === 'video') {
        // Create a local URL for preview (temporary)
        const videoUrl = URL.createObjectURL(file)
        setMediaUrl(videoUrl)
        
        // Auto-fill title with filename if empty
        if (!mediaTitle) {
          setMediaTitle(file.name.replace(/\.[^/.]+$/, ""))
        }
        
        toast.success(`Vídeo ${file.name} carregado com sucesso!`)
        toast.info('⚠️ Para vídeos, recomendamos usar URL externa para melhor performance')
        return
      }

      // For images, convert to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Url = e.target?.result as string
        setMediaUrl(base64Url)
        
        // Auto-fill title with filename if empty
        if (!mediaTitle) {
          setMediaTitle(file.name.replace(/\.[^/.]+$/, ""))
        }
        
        toast.success(`Imagem ${file.name} carregada com sucesso!`)
      }
      reader.onerror = () => {
        toast.error('Erro ao carregar o arquivo')
      }
      reader.readAsDataURL(file)
      
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Erro ao fazer upload do arquivo')
    }
  }

  const handleAddMedia = async () => {
    if (!selectedModalityId || !mediaUrl || !mediaTitle) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      console.log('🔄 Saving media to Supabase...')
      
      // Show different loading messages for videos
      if (mediaType === 'video') {
        toast.info('⏳ Processando vídeo... Isso pode demorar um pouco.')
      }
      
      // Save to Supabase with corrected field names
      const mediaData = {
        modality_slug: selectedModalityId, // Use slug instead of id
        type: mediaType,
        url: mediaUrl,
        title: mediaTitle,
        description: mediaDescription,
        category: 'regular' as const
      }

      console.log('📊 Media data to save:', mediaData)
      
      // Set timeout based on media type
      const timeoutDuration = mediaType === 'video' ? 120000 : 30000 // 2min for video, 30s for image
      
      const savedMedia = await Promise.race([
        SupabaseService.addMedia(mediaData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: Operação demorou muito')), timeoutDuration)
        )
      ]) as any
      
      console.log('✅ Media saved to Supabase:', savedMedia)
      
      // Also save to local storage for compatibility (with converted format)
      const newMedia: MediaItem = {
        id: savedMedia.id,
        modalityId: selectedModalityId, // Keep old format for local compatibility
        type: mediaType,
        url: mediaUrl,
        title: mediaTitle,
        description: mediaDescription,
        category: 'regular'
      }

      onAddMedia(newMedia)
      
      // Reset form
      setMediaUrl('')
      setMediaTitle('')
      setMediaDescription('')
      setSelectedModalityId('')
      
      toast.success('✅ Mídia salva permanentemente no Supabase! Agora é visível para todos.')
    } catch (error: any) {
      console.error('❌ Error saving media:', error)
      
      if (error.message?.includes('Timeout')) {
        toast.error('Timeout: Arquivo muito grande ou conexão lenta. Tente usar URL externa para vídeos.')
      } else {
        toast.error(`Erro ao salvar mídia: ${error.message || 'Tente novamente.'}`)
      }
    }
  }

  const handleDeleteMedia = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta mídia?')) {
      try {
        // Delete from Supabase
        await SupabaseService.deleteMedia(id)
        
        // Also delete from local storage
        onDeleteMedia(id)
        
        toast.success('Mídia excluída permanentemente!')
      } catch (error) {
        console.error('Error deleting media:', error)
        toast.error('Erro ao excluir mídia. Tente novamente.')
      }
    }
  }

  const getModalityMedia = (modalityId: string) => {
    return (media || []).filter(m => m.modalityId === modalityId)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <Button variant="outline" onClick={() => onBack()}>
              <FaArrowLeft size={16} className="mr-2" />
              Voltar ao Site
            </Button>
            {onLogout && (
              <Button 
                variant="outline" 
                onClick={() => {
                  onLogout()
                  onBack()
                }} 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <FaSignOutAlt size={16} className="mr-2" />
                Logout
              </Button>
            )}
          </div>
          <h1 className="text-4xl font-black text-foreground">
            Painel Administrativo
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Gerencie conteúdo da Academia Mateus
          </p>
        </div>

        <Tabs defaultValue="media" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="media" className="flex items-center gap-2">
              <FaImage size={16} />
              Mídia e Modalidades
            </TabsTrigger>
            <TabsTrigger value="transformations" className="flex items-center gap-2">
              <FaStar size={16} />
              Histórias de Transformação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Add Media Form */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaPlus size={20} />
                    Adicionar Nova Mídia Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="modality">Modalidade *</Label>
                      <Select value={selectedModalityId} onValueChange={setSelectedModalityId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {modalities?.map((modality) => (
                            <SelectItem key={modality.id} value={modality.id}>
                              <div className="flex items-center gap-2">
                                <FaDumbbell size={16} />
                                {modality.title}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="type">Tipo de Mídia *</Label>
                      <Select value={mediaType} onValueChange={(value: 'image' | 'video') => setMediaType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">
                            <div className="flex items-center gap-2">
                              <FaImage size={16} />
                              Foto Profissional
                            </div>
                          </SelectItem>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <FaPlay size={16} />
                              Vídeo Promocional
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título da Mídia *</Label>
                      <Input
                        id="title"
                        value={mediaTitle}
                        onChange={(e) => setMediaTitle(e.target.value)}
                        placeholder={
                          mediaType === 'image' 
                            ? "Ex: Treino funcional em grupo"
                            : "Ex: Demonstração de exercícios"
                        }
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        value={mediaDescription}
                        onChange={(e) => setMediaDescription(e.target.value)}
                        placeholder="Breve descrição da mídia"
                      />
                    </div>
                  </div>

                  <Tabs value={uploadMethod} onValueChange={(value: 'url' | 'file') => setUploadMethod(value)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <FaLink size={16} />
                        URL da Mídia
                      </TabsTrigger>
                      <TabsTrigger value="file" className="flex items-center gap-2">
                        <FaFile size={16} />
                        Upload de Arquivo
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url" className="space-y-4">
                      <div>
                        <Label htmlFor="url">URL da {mediaType === 'image' ? 'Foto' : 'Vídeo'} *</Label>
                        <Input
                          id="url"
                          value={mediaUrl}
                          onChange={(e) => setMediaUrl(e.target.value)}
                          placeholder={
                            mediaType === 'image' 
                              ? "https://exemplo.com/foto-academia.jpg"
                              : "https://youtube.com/watch?v=... ou https://vimeo.com/..."
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {mediaType === 'image' 
                            ? "Cole o link direto da imagem (JPG, PNG, WebP)"
                            : "Cole o link do YouTube, Vimeo ou link direto do vídeo"
                          }
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="file" className="space-y-4">
                      <div>
                        <Label htmlFor="file">Arquivo da {mediaType === 'image' ? 'Foto' : 'Vídeo'} *</Label>
                        <div className="flex flex-col gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full"
                          >
                            <FaUpload size={16} className="mr-2" />
                            Selecionar Arquivo
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(file)
                            }}
                            className="hidden"
                          />
                          {mediaUrl && (
                            <p className="text-sm text-green-600">
                              Arquivo carregado: {mediaTitle || 'Arquivo selecionado'}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {mediaType === 'image' 
                            ? "Formatos: JPG, PNG, WebP (máx. 10MB)"
                            : "Formatos: MP4, WebM, MOV (máx. 100MB)"
                          }
                        </p>
                        {mediaType === 'video' && (
                          <div className="text-xs bg-blue-50 border border-blue-200 p-2 rounded">
                            <p className="font-medium text-blue-800">💡 Dica para vídeos:</p>
                            <p className="text-blue-700">Para melhor performance, recomendamos:</p>
                            <ul className="list-disc list-inside text-blue-700 ml-2">
                              <li>Usar URL externa (YouTube, Vimeo, etc.)</li>
                              <li>Ou upload de vídeos pequenos (&lt;50MB)</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button 
                    onClick={handleAddMedia} 
                    className="w-full" 
                    disabled={!selectedModalityId || !mediaUrl || !mediaTitle}
                  >
                    <FaPlus size={16} className="mr-2" />
                    Adicionar Mídia
                  </Button>
                  
                  {/* Debug info */}
                  <div className="text-xs text-muted-foreground space-y-1 p-2 bg-muted rounded">
                    <p>Debug - Valores necessários:</p>
                    <p>• Modalidade: {selectedModalityId || 'VAZIO'}</p>
                    <p>• URL: {mediaUrl ? 'DEFINIDA' : 'VAZIA'}</p>
                    <p>• Título: {mediaTitle || 'VAZIO'}</p>
                    <p>• Botão habilitado: {(!selectedModalityId || !mediaUrl || !mediaTitle) ? 'NÃO' : 'SIM'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaUsers size={20} />
                    Diretrizes de Conteúdo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4 text-sm">
                    <div>
                      <strong>Crossfit:</strong>
                      <ul className="list-disc list-inside ml-2 text-muted-foreground">
                        <li>WODs em ação</li>
                        <li>Uso de equipamentos funcionais</li>
                        <li>Treinos em grupo</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Musculação:</strong>
                      <ul className="list-disc list-inside ml-2 text-muted-foreground">
                        <li>Técnicas de execução</li>
                        <li>Diferentes aparelhos</li>
                        <li>Progressão de cargas</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Zumba:</strong>
                      <ul className="list-disc list-inside ml-2 text-muted-foreground">
                        <li>Coreografias dinâmicas</li>
                        <li>Energia da turma</li>
                        <li>Movimentos característicos</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Instalações:</strong>
                      <ul className="list-disc list-inside ml-2 text-muted-foreground">
                        <li>Áreas de treino</li>
                        <li>Equipamentos modernos</li>
                        <li>Vestiários e recepção</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {modalities?.map((modality) => {
                const modalityMedia = getModalityMedia(modality.id)
                return (
                  <Card key={modality.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FaDumbbell size={16} />
                          {modality.title}
                        </span>
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {modalityMedia.length}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid gap-2 p-4 pt-0">
                        {modalityMedia.length === 0 ? (
                          <div className="h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                              <FaImage size={24} className="mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Nenhuma mídia</p>
                            </div>
                          </div>
                        ) : (
                          modalityMedia.map((item) => (
                            <div key={item.id} className="relative group">
                              {item.type === 'image' ? (
                                <img
                                  src={item.url}
                                  alt={item.title}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="relative w-full h-24 bg-black rounded-lg flex items-center justify-center">
                                  <FaPlay className="text-white text-2xl" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteMedia(item.id)}
                                  className="scale-75"
                                >
                                  <FaTrash size={12} />
                                </Button>
                              </div>
                              <div className="absolute bottom-1 left-1 right-1">
                                <p className="text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded truncate">
                                  {item.title}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="transformations">
            <TransformationStoriesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
