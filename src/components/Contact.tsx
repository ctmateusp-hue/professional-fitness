import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Phone, Mail, InstagramLogo, WhatsappLogo } from '@phosphor-icons/react'

export function Contact() {
  return (
    <section id="contato" className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-4">
            Vamos Treinar Juntos?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Entre em contato conosco e comece sua transformação hoje mesmo. 
            Nossa equipe está pronta para te ajudar!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-8">Informações de Contato</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-accent-foreground" weight="bold" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Endereço</h4>
                  <p className="text-primary-foreground/80">
                    Rua do Fitness, 123<br />
                    Centro - Sua Cidade, Estado<br />
                    CEP: 12345-678
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-accent-foreground" weight="bold" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Horário de Funcionamento</h4>
                  <p className="text-primary-foreground/80">
                    Segunda a Sexta: 05h às 23h<br />
                    Sábado: 07h às 20h<br />
                    Domingo: 08h às 18h
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-accent-foreground" weight="bold" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Telefone</h4>
                  <p className="text-primary-foreground/80">
                    (11) 9999-9999
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-accent-foreground" weight="bold" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-primary-foreground/80">
                    contato@fitzoneacademy.com
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Siga-nos nas Redes Sociais</h4>
              <div className="flex gap-4">
                <Button size="sm" variant="secondary" className="bg-accent hover:bg-accent/90">
                  <InstagramLogo size={18} className="mr-2" weight="bold" />
                  Instagram
                </Button>
                <Button size="sm" variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">
                  <WhatsappLogo size={18} className="mr-2" weight="bold" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary-foreground">
                Solicite uma Avaliação Gratuita
              </h3>
              
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-primary-foreground placeholder-primary-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-primary-foreground placeholder-primary-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    placeholder="Seu WhatsApp"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-primary-foreground placeholder-primary-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <select className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="" className="text-foreground">Modalidade de interesse</option>
                    <option value="functional" className="text-foreground">Funcional/Cross</option>
                    <option value="musculacao" className="text-foreground">Musculação</option>
                    <option value="zumba" className="text-foreground">Zumba</option>
                  </select>
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  Solicitar Avaliação Gratuita
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}