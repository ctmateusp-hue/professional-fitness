import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, Trash, Image as ImageIcon, VideoCamera } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Modality, MediaItem } from '../App'

interface AdminPanelProps {
  onBack: () => void
  modalities: Modality[]
}

export function AdminPanel({ onBack, modalities }: AdminPanelProps) {
  const [media, setMedia] = useKV<MediaItem[]>('gym-media', [])
  const [selectedModality, setSelectedModality] = useState<string>('')
  const [mediaTitle, setMediaTitle] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [isUploading, setIsUploading] = useState(false)

  const handleMediaUpload = async () => {
    if (!selectedModality || !mediaTitle.trim()) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    setIsUploading(true)
    
    try {
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        modalityId: selectedModality,
        type: mediaType,
        url: `placeholder-${mediaType}-${Date.now()}`,
        title: mediaTitle.trim(),
        thumbnail: mediaType === 'video' ? `thumbnail-${Date.now()}` : undefined
      }

      setMedia(currentMedia => [...currentMedia, newMedia])
      setMediaTitle('')
      toast.success('Mídia adicionada com sucesso!')
    } catch (error) {
      toast.error('Erro ao adicionar mídia')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteMedia = (mediaId: string) => {
    setMedia(currentMedia => currentMedia.filter(m => m.id !== mediaId))
    toast.success('Mídia removida com sucesso!')
  }

  const getModalityMedia = (modalityId: string) => {
    return media.filter(m => m.modalityId === modalityId)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft size={20} className="mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-foreground">
                Painel Administrativo
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Total de mídias: {media.length}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                Adicionar Mídia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="modality">Modalidade</Label>
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
                <Label htmlFor="type">Tipo de Mídia</Label>
                <Select value={mediaType} onValueChange={(value: 'image' | 'video') => setMediaType(value)}>
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
                <Label htmlFor="title">Título da Mídia</Label>
                <Input
                  id="title"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="Ex: Treino de peito e tríceps"
                />
              </div>

              <Button 
                onClick={handleMediaUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? 'Adicionando...' : 'Adicionar Mídia'}
              </Button>

              <p className="text-xs text-muted-foreground">
                Nota: Este é um demo. Em produção, você poderia fazer upload de arquivos reais.
              </p>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Tabs defaultValue={modalities[0]?.id} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {modalities.map((modality) => (
                  <TabsTrigger key={modality.id} value={modality.id} className="text-sm">
                    {modality.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {modalities.map((modality) => (
                <TabsContent key={modality.id} value={modality.id} className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Mídia - {modality.title}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {getModalityMedia(modality.id).length} itens
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getModalityMedia(modality.id).length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon size={24} />
                          </div>
                          <p>Nenhuma mídia adicionada ainda</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getModalityMedia(modality.id).map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                              <CardContent className="p-0">
                                <div className="aspect-video bg-muted flex items-center justify-center">
                                  {item.type === 'video' ? (
                                    <VideoCamera size={32} className="text-muted-foreground" />
                                  ) : (
                                    <ImageIcon size={32} className="text-muted-foreground" />
                                  )}
                                </div>
                                <div className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-medium text-sm truncate">
                                        {item.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground capitalize">
                                        {item.type === 'video' ? 'Vídeo' : 'Imagem'}
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteMedia(item.id)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash size={16} />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}