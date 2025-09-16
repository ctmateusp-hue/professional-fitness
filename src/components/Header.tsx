import { Logo } from './Logo'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isGalleryDropdownOpen, setIsGalleryDropdownOpen] = useState(false)
  const { scrollY } = useScroll()
  
  const headerY = useTransform(scrollY, [0, 100], [0, -10])
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9])

  const galleryOptions = [
    { id: 'functional', title: 'Funcional/Cross' },
    { id: 'musculacao', title: 'Musculação' },
    { id: 'zumba', title: 'Zumba' }
  ]

  const handleGalleryOptionClick = (modalityId: string) => {
    setIsGalleryDropdownOpen(false)
    
    // First scroll to modalidades section, then trigger modality selection
    const modalidadesSection = document.querySelector('#modalidades')
    if (modalidadesSection) {
      modalidadesSection.scrollIntoView({ behavior: 'smooth' })
      
      // Wait a bit for scroll, then trigger modality button click
      setTimeout(() => {
        const modalityCard = document.querySelector(`[data-modality-id="${modalityId}"]`)
        if (modalityCard) {
          const button = modalityCard.querySelector('button')
          if (button) {
            button.click()
          }
        }
      }, 800) // Delay to allow smooth scroll to complete
    }
  }

  const handleGeneralGalleryClick = () => {
    // Just scroll to modalidades section for general gallery access
    const modalidadesSection = document.querySelector('#modalidades')
    if (modalidadesSection) {
      modalidadesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50)
    })
    return () => unsubscribe()
  }, [scrollY])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isGalleryDropdownOpen) {
        const target = event.target as HTMLElement
        if (!target.closest('.gallery-dropdown')) {
          setIsGalleryDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isGalleryDropdownOpen])

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
            
            {/* Gallery Dropdown */}
            <div className="relative gallery-dropdown">
              <motion.button
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setIsGalleryDropdownOpen(!isGalleryDropdownOpen)}
              >
                Galeria
                <motion.div
                  animate={{ rotate: isGalleryDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown size={12} />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {isGalleryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border py-2 min-w-[180px] z-50"
                  >
                    <motion.button
                      onClick={handleGeneralGalleryClick}
                      className="w-full text-left px-4 py-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors font-medium border-b border-gray-200"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      Ver todas as modalidades
                    </motion.button>
                    {galleryOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        onClick={() => handleGalleryOptionClick(option.id)}
                        className="w-full text-left px-4 py-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {option.title}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
        </div>
      </div>
    </motion.header>
  )
}