import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from '@phosphor-icons/react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Logo } from './Logo'

export function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const logoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const logoScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <section ref={ref} id="home" className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated Logo Background */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
        style={{ 
          y: logoY,
          opacity: logoOpacity,
          scale: logoScale
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Logo size={600} showText={false} />
      </motion.div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
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
          </motion.div>

          {/* Featured Logo with Animation */}
          <motion.div 
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50, rotateY: -30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.6,
              type: "spring",
              stiffness: 100
            }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Logo size={280} showText={true} animated={true} className="relative z-10" />
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
    </section>
  )
}