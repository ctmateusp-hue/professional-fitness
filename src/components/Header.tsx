import { Button } from '@/components/ui/button'
import { Shield } from '@phosphor-icons/react'
import { Logo } from './Logo'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface HeaderProps {
  onAdminClick: () => void
  isAdmin: boolean
  onAdminLogin: () => void
}

export function Header({ onAdminClick, isAdmin, onAdminLogin }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  const headerY = useTransform(scrollY, [0, 100], [0, -10])
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9])

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50)
    })
    return () => unsubscribe()
  }, [scrollY])

  const handleAdminAccess = async () => {
    if (!isAdmin) {
      // Simple password check for demo
      const password = prompt('Digite a senha do administrador:')
      if (password === 'admin123') {
        onAdminLogin()
        onAdminClick()
      } else {
        toast.error('Senha incorreta!')
      }
    } else {
      onAdminClick()
    }
  }

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b' 
          : 'bg-white shadow-sm border-b'
      }`}
      style={{ y: headerY }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center gap-3"
            style={{ scale: logoScale }}
          >
            <motion.div
              animate={isScrolled ? {
                rotate: [0, 5, 0],
                transition: { duration: 2, repeat: Infinity }
              } : {}}
            >
              <Logo size={50} showText={false} animated={true} />
            </motion.div>
            <motion.h1 
              className="text-xl font-black text-foreground tracking-tight"
              animate={isScrolled ? { x: [0, 2, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              CT MATEUS PAVANELLO
            </motion.h1>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-8">
            <motion.a 
              href="#home" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Início
            </motion.a>
            <motion.a 
              href="#modalidades" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Modalidades
            </motion.a>
            <motion.a 
              href="#galeria" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Galeria
            </motion.a>
            <motion.a 
              href="#precos" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Preços
            </motion.a>
            <motion.a 
              href="#contato" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Contato
            </motion.a>
          </nav>
          
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAdminAccess}
                className="hidden sm:flex items-center gap-2"
              >
                <Shield size={16} />
                Admin
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}