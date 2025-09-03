import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Upload, Trash2, Plus, Save, Image as ImageIcon, Play, Link, File } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { Modality, MediaItem } from '../App'
import { SampleContent } from './SampleContent'
import { toast } from 'sonner'

interface AdminPanelProps {
  onBack: () => void
  modalities: Modality[]
}

export function AdminPanel({ onBack, modalities }: AdminPanelProps) {
  const [media, setMedia] = useKV<MediaItem[]>('gym-media', [])
  const [selectedModality, setSelectedModality] = useState<string>('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [mediaTitle, setMediaTitle] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaDescription, setMediaDescription] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    // Create a blob URL for the file to simulate upload
    // In a real app, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
    const blobUrl = URL.createObjectURL(file)
    setMediaUrl(blobUrl)
    
    // Auto-fill title with filename if empty
    if (!mediaTitle) {
      setMediaTitle(file.name.replace(/\.[^/.]+$/, ""))
    }
    
    toast.success(`Arquivo ${file.name} carregado com sucesso!`)
  }

  const addMedia = () => {
    if (!selectedModality || !mediaTitle || !mediaUrl) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const newMedia: MediaItem = {
      id: Date.now().toString(),
      modalityId: selectedModality,
      type: mediaType,
      url: mediaUrl,
      title: mediaTitle,
      description: mediaDescription,
      thumbnail: mediaType === 'video' && mediaUrl.includes('youtube.com') 
        ? `https://img.youtube.com/vi/${extractYouTubeId(mediaUrl)}/maxresdefault.jpg`
        : undefined
    }

    setMedia((current) => [...current, newMedia])
    setMediaTitle('')
    setMediaUrl('')
    setMediaDescription('')
    toast.success('Mídia adicionada com sucesso!')
  }

  const extractYouTubeId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match?.[1] || ''
  }

  const removeMedia = (mediaId: string) => {
    setMedia((current) => current.filter(m => m.id !== mediaId))
    toast.success('Mídia removida com sucesso!')
  }

  const getModalityMedia = (modalityId: string) => {
    return media.filter(m => m.modalityId === modalityId)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao Site
          </Button>
          <h1 className="text-4xl font-black text-foreground">
            Painel Administrativo
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Gerencie fotos e vídeos das modalidades da academia
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Add Media Form */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} />
                Adicionar Nova Mídia Profissional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modality">Modalidade *</Label>
                  <Select value={selectedModality} onValueChange={setSelectedModality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {modalities.map((modality) => (
                        <SelectItem key={modality.id} value={modality.id}>
                          {modality.title}
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
                          <ImageIcon size={16} />
                          Foto Profissional
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Play size={16} />
                          Vídeo de Treino
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Título da Mídia *</Label>
                <Input
                  id="title"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="Ex: Treino Funcional - Turma Manhã | Equipamentos de Musculação"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={mediaDescription}
                  onChange={(e) => setMediaDescription(e.target.value)}
                  placeholder="Descreva o conteúdo da mídia, exercícios mostrados, equipamentos utilizados..."
                  rows={3}
                />
              </div>

              <Tabs value={uploadMethod} onValueChange={(value: 'url' | 'file') => setUploadMethod(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Link size={16} />
                    URL da Mídia
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <File size={16} />
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
                        : "URLs do YouTube, Vimeo ou link direto do vídeo"
                      }
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="file" className="space-y-4">
                  <div>
                    <Label>Upload de {mediaType === 'image' ? 'Foto' : 'Vídeo'} *</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
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
                      <div className="space-y-2">
                        <Upload size={32} className="mx-auto text-muted-foreground" />
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Escolher {mediaType === 'image' ? 'Foto' : 'Vídeo'}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {mediaType === 'image' 
                            ? "Formatos: JPG, PNG, WebP (máx. 10MB)"
                            : "Formatos: MP4, MOV, AVI (máx. 100MB)"
                          }
                        </p>
                      </div>
                    </div>
                    {mediaUrl && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm font-medium text-green-600">
                          ✓ Arquivo carregado com sucesso
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={addMedia} className="w-full" size="lg">
                <Save size={16} className="mr-2" />
                Adicionar à Galeria
              </Button>
            </CardContent>
          </Card>

          {/* Media Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                Galeria por Modalidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modalities.map((modality) => {
                  const modalityMedia = getModalityMedia(modality.id)
                  const images = modalityMedia.filter(m => m.type === 'image')
                  const videos = modalityMedia.filter(m => m.type === 'video')
                  
                  return (
                    <div key={modality.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">
                          {modality.title}
                        </h3>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ImageIcon size={14} />
                            {images.length} fotos
                          </span>
                          <span className="flex items-center gap-1">
                            <Play size={14} />
                            {videos.length} vídeos
                          </span>
                        </div>
                      </div>
                      
                      {modalityMedia.length === 0 ? (
                        <div className="text-center py-8 bg-muted/30 rounded-md">
                          <ImageIcon size={32} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            Nenhuma mídia adicionada ainda
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Adicione fotos profissionais e vídeos de treino
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {modalityMedia.map((item) => (
                            <div 
                              key={item.id}
                              className="group relative bg-muted/50 p-3 rounded-md hover:bg-muted/70 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <div className={`w-12 h-12 rounded-md flex items-center justify-center ${
                                    item.type === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                  }`}>
                                    {item.type === 'image' ? (
                                      <ImageIcon size={20} />
                                    ) : (
                                      <Play size={20} />
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {item.title}
                                  </p>
                                  {item.description && (
                                    <p className="text-xs text-muted-foreground mt-1 overflow-hidden">
                                      <span className="block truncate">
                                        {item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description}
                                      </span>
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.type === 'image' ? 'Foto profissional' : 'Vídeo de treino'}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeMedia(item.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Guia para Mídia Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <ImageIcon size={18} className="text-blue-600" />
                    Fotos Profissionais
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Use fotos em alta resolução</li>
                    <li>Mostre equipamentos e instalações</li>
                    <li>Capture pessoas treinando</li>
                    <li>Boa iluminação e composição</li>
                    <li>Formatos: JPG, PNG, WebP</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Play size={18} className="text-red-600" />
                    Vídeos de Treino
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Demonstre exercícios corretos</li>
                    <li>Mostre diferentes modalidades</li>
                    <li>YouTube e Vimeo são ideais</li>
                    <li>Duração entre 30s e 5min</li>
                    <li>Qualidade mínima 720p</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Upload size={18} className="text-green-600" />
                    Dicas de Upload
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Títulos descritivos e específicos</li>
                    <li>Use descrições detalhadas</li>
                    <li>Organize por modalidade</li>
                    <li>Teste URLs antes de adicionar</li>
                    <li>Mantenha qualidade consistente</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <SampleContent />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 Sugestões de Conteúdo Profissional</CardTitle>
          </CardHeader>
          <CardContent>            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Funcional/Cross:</strong>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>Circuitos de exercícios</li>
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
    </div>
  )
}