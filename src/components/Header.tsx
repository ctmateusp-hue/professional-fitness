import { Button } from '@/components/ui/button'
import { Dumbbell, Shield } from '@phosphor-icons/react'

interface HeaderProps {
  onAdminClick: () => void
  isAdmin: boolean
  onAdminLogin: () => void
}

export function Header({ onAdminClick, isAdmin, onAdminLogin }: HeaderProps) {
  const handleAdminAccess = async () => {
    if (!isAdmin) {
      const user = await spark.user()
      if (user.isOwner) {
        onAdminLogin()
        onAdminClick()
      } else {
        // Simple password check for demo
        const password = prompt('Digite a senha do administrador:')
        if (password === 'admin123') {
          onAdminLogin()
          onAdminClick()
        } else {
          alert('Senha incorreta!')
        }
      }
    } else {
      onAdminClick()
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell size={24} className="text-primary-foreground" weight="bold" />
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              FitZone Academy
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
              Início
            </a>
            <a href="#modalidades" className="text-foreground hover:text-primary transition-colors font-medium">
              Modalidades
            </a>
            <a href="#galeria" className="text-foreground hover:text-primary transition-colors font-medium">
              Galeria
            </a>
            <a href="#contato" className="text-foreground hover:text-primary transition-colors font-medium">
              Contato
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAdminAccess}
              className="hidden sm:flex items-center gap-2"
            >
              <Shield size={16} />
              Admin
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Matricule-se
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}