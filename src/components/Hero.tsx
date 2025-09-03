import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from '@phosphor-icons/react'

export function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none mb-6">
            Transforme seu
            <span className="block text-accent">Corpo</span>
            <span className="block">e Mente</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Academia profissional com metodologia própria. Treinos personalizados 
            para nossa comunidade com foco em resultados reais.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-4">
              Comece Hoje
              <ArrowRight size={20} className="ml-2" weight="bold" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-4"
            >
              <Play size={20} className="mr-2" weight="fill" />
              Conheça a Academia
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
    </section>
  )
}