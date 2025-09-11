import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { toast } from 'sonner'
import { FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaInstagram } from 'react-icons/fa'
import whatsappIcon from '../assets/whatsapp.png'

const WHATSAPP_LINK = "https://wa.me/5517988275111?text=Quero%20agendar%20uma%20aula%20experimental";
const INSTAGRAM_LINK = "https://www.instagram.com/ctmateuspavanello?igsh=YW43b2lpeWNnZWY3&utm_source=qr";

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
                  <FaMapMarkerAlt size={24} className="text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Endereço</h4>
                  <p className="text-primary-foreground/80">
                    Rua Benevenuto Pereira Silva, Nº 329<br />
                    Bairro Nobre Ville<br />
                    <span className="text-sm opacity-75">Referência: 50m à frente do Hotel do Lago</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaClock size={24} className="text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Horário de Funcionamento</h4>
                  <p className="text-primary-foreground/80">
                    <FaClock size={16} className="inline mr-1" /> 05:50 às 09:00<br />
                    <FaClock size={16} className="inline mr-1" /> 15:30 às 20:00
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone size={24} className="text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">WhatsApp/Telefone</h4>
                  <a 
                    href={WHATSAPP_LINK} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    (17) 98827-5111
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaEnvelope size={24} className="text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <a 
                    href="mailto:mateustsp@gmail.com"
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    mateustsp@gmail.com
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Siga-nos nas Redes Sociais</h4>
              <div className="flex gap-4">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-0"
                  asChild
                >
                  <a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer">
                    <FaInstagram size={18} className="mr-2" />
                    Instagram
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  asChild
                >
                  <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                    <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary-foreground">
                Nossa Localização
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaMapMarkerAlt size={24} className="text-accent" />
                  <div>
                    <p className="font-semibold text-primary-foreground">
                      Rua Benevenuto Pereira Silva, Nº 329
                    </p>
                    <p className="text-primary-foreground/80 text-sm">
                      Bairro Nobre Ville - 50m à frente do Hotel do Lago
                    </p>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-lg border border-white/20">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.2!2d-48.3147621154785!3d-20.3345527648926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDIwJzA0LjQiUyA0OMKwMTgnNTMuMSJX!5e0!3m2!1spt-BR!2sbr!4v1"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    size="lg" 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                    asChild
                  >
                    <a 
                      href="https://www.google.com/maps?q=-20.3345527648926,-48.3147621154785" 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <FaMapMarkerAlt size={20} className="mr-2" />
                      Ver no Google Maps
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}