import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FaWhatsapp, FaTimes } from 'react-icons/fa'
import { toast } from 'sonner'
import { SupabaseService, Lead } from '@/lib/supabase'

interface LeadCaptureProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  ctaText?: string
}

export function LeadCapture({ isOpen, onClose, title = "Agende sua Aula Experimental", ctaText = "Quero Experimentar!" }: LeadCaptureProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    objective: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get UTM parameters from URL
  const getUtmParams = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone) {
      toast.error('Preencha pelo menos nome e telefone')
      return
    }

    setIsSubmitting(true)
    
    try {
      const leadData: Omit<Lead, 'id' | 'created_at'> = {
        ...formData,
        ...getUtmParams()
      }
      
      await SupabaseService.createLead(leadData)
      
      toast.success('🎉 Dados enviados! Entraremos em contato em breve.')
      
      // Reset form
      setFormData({ name: '', phone: '', email: '', objective: '' })
      onClose()
      
      // Optional: Redirect to WhatsApp after a delay
      setTimeout(() => {
        const whatsappMessage = `Olá! Vim pelo site e gostaria de agendar uma aula experimental. Meu nome é ${formData.name}.`
        const whatsappUrl = `https://api.whatsapp.com/send?phone=5517999999999&text=${encodeURIComponent(whatsappMessage)}`
        window.open(whatsappUrl, '_blank')
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting lead:', error)
      toast.error('Erro ao enviar dados. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-2 top-2 h-8 w-8 p-0"
        >
          <FaTimes />
        </Button>
        
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {title}
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Preencha seus dados e entraremos em contato
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">WhatsApp *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(17) 99999-9999"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="objective">Objetivo (opcional)</Label>
              <Textarea
                id="objective"
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                placeholder="Ex: Perder peso, ganhar massa muscular, melhorar condicionamento..."
                rows={3}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !formData.name || !formData.phone}
            >
              {isSubmitting ? (
                'Enviando...'
              ) : (
                <>
                  <FaWhatsapp className="mr-2" />
                  {ctaText}
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Seus dados estão seguros conosco. Não enviamos spam.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}