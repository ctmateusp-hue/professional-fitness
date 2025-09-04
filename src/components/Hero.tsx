import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const WHATSAPP_LINK = "https://wa.me/5517988275111?text=Quero%20agendar%20uma%20aula%20experimental";

export function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            className="text-center max-w-4xl relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Partículas de energia de fundo - simplificadas */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-accent rounded-full opacity-60"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{ 
                    duration: 2, 
                    delay: 1 + i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 4
                  }}
                  style={{
                    left: `${20 + (i * 15)}%`,
                    top: `${30 + (i % 3) * 15}%`
                  }}
                />
              ))}
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none mb-6 overflow-hidden">
              {/* Transforme seu */}
              <motion.span 
                className="block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Transforme seu
              </motion.span>
              
              {/* Corpo */}
              <motion.span 
                className="block text-accent relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                Corpo
              </motion.span>
              
              {/* e Mente */}
              <motion.span 
                className="block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                e Mente
              </motion.span>
            </h1>
            
            {/* Linha de energia que aparece depois */}
            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-4"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 1.5,
                ease: "easeOut"
              }}
            />
            
            <motion.p 
              className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
            >
              Academia profissional com metodologia própria. Treinos personalizados 
              para nossa comunidade com foco em resultados reais.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 2.2, ease: "easeOut" }}
            >
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-4 font-medium"
                asChild
              >
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                  Comece Hoje
                  <ArrowRight size={20} className="ml-2" weight="bold" />
                </a>
              </Button>
              
              <Button 
                size="lg" 
                variant="ghost" 
                className="border-2 border-white/40 !text-white !bg-transparent hover:!bg-white/20 hover:!text-white hover:!border-white/60 text-lg px-8 py-4 font-medium"
                asChild
              >
                <a href="#contato" className="text-white">
                  <Play size={20} className="mr-2 text-white" weight="fill" />
                  Conheça a Academia
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
    </section>
  )
}