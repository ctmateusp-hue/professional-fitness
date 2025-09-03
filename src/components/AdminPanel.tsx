import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, Trash2, Plus, Save } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { Modality, MediaItem } from '../App'
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

  const addMedia = () => {
    if (!selectedModality || !mediaTitle || !mediaUrl) {
      toast.error('Preencha todos os campos')
      return
    }

    const newMedia: MediaItem = {
      id: Date.now().toString(),
      modalityId: selectedModality,
      type: mediaType,
      url: mediaUrl,
      title: mediaTitle,
      thumbnail: mediaType === 'video' ? mediaUrl + '?thumbnail' : undefined
    }

    setMedia((current) => [...current, newMedia])
    setMediaTitle('')
    setMediaUrl('')
    toast.success('Mídia adicionada com sucesso!')
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Media Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} />
                Adicionar Nova Mídia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  placeholder="Ex: Treino de Musculação - Série A"
                />
              </div>

              <div>
                <Label htmlFor="url">URL da {mediaType === 'image' ? 'Imagem' : 'Vídeo'}</Label>
                <Input
                  id="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Ex: https://exemplo.com/imagem.jpg"
                />
              </div>

              <Button onClick={addMedia} className="w-full">
                <Save size={16} className="mr-2" />
                Adicionar Mídia
              </Button>
            </CardContent>
          </Card>

          {/* Media Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                Mídia por Modalidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modalities.map((modality) => {
                  const modalityMedia = getModalityMedia(modality.id)
                  
                  return (
                    <div key={modality.id} className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-3">
                        {modality.title}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({modalityMedia.length} item{modalityMedia.length !== 1 ? 's' : ''})
                        </span>
                      </h3>
                      
                      {modalityMedia.length === 0 ? (
                        <p className="text-muted-foreground italic">
                          Nenhuma mídia adicionada ainda
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {modalityMedia.map((item) => (
                            <div 
                              key={item.id}
                              className="flex items-center justify-between bg-muted/50 p-3 rounded-md"
                            >
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.type === 'image' ? 'Imagem' : 'Vídeo'} • {item.url.substring(0, 30)}...
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeMedia(item.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
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

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instruções de Uso</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Como adicionar mídia:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Selecione a modalidade desejada</li>
                  <li>Escolha o tipo de mídia (imagem ou vídeo)</li>
                  <li>Digite um título descritivo</li>
                  <li>Cole a URL da mídia</li>
                  <li>Clique em "Adicionar Mídia"</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dicas importantes:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Use URLs diretas de imagens (jpg, png, webp)</li>
                  <li>Para vídeos, use URLs do YouTube ou Vimeo</li>
                  <li>Títulos devem ser descritivos e informativos</li>
                  <li>Teste as URLs antes de adicionar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}