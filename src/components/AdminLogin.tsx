import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa'
import { toast } from 'sonner'

interface AdminLoginProps {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Get stored credentials
  const getStoredCredentials = () => {
    console.log('getStoredCredentials called')
    try {
      const stored = localStorage.getItem('admin-credentials')
      console.log('stored in localStorage:', stored)
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('parsed credentials:', parsed)
        return parsed
      }
      // Default credentials for first access
      const defaultCreds = { username: 'admin', password: 'Mateus##12', isFirstAccess: true }
      console.log('using default credentials:', defaultCreds)
      return defaultCreds
    } catch (error) {
      console.error('Error getting stored credentials:', error)
      const defaultCreds = { username: 'admin', password: 'Mateus##12', isFirstAccess: true }
      console.log('fallback to default credentials:', defaultCreds)
      return defaultCreds
    }
  }

  const handleLogin = () => {
    console.log('handleLogin called')
    console.log('credentials:', credentials)
    
    try {
      const storedCreds = getStoredCredentials()
      console.log('storedCreds:', storedCreds)
      
      if (credentials.username === storedCreds.username && credentials.password === storedCreds.password) {
        console.log('Credentials match!')
        if (storedCreds.isFirstAccess) {
          console.log('First access - requesting password change')
          setIsChangingPassword(true)
          toast.info('Por segurança, defina uma nova senha no primeiro acesso')
        } else {
          console.log('Calling onLogin()')
          onLogin()
          toast.success('Login realizado com sucesso!')
        }
      } else {
        console.log('Credentials do not match')
        console.log('Expected username:', storedCreds.username, 'Got:', credentials.username)
        console.log('Expected password:', storedCreds.password, 'Got:', credentials.password)
        toast.error('Usuário ou senha incorretos!')
      }
    } catch (error) {
      console.error('Error in handleLogin:', error)
      toast.error('Erro ao fazer login. Verifique o console.')
    }
  }

  const handlePasswordChange = () => {
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    const newCredentials = {
      username: 'admin',
      password: newPassword,
      isFirstAccess: false
    }

    localStorage.setItem('admin-credentials', JSON.stringify(newCredentials))
    toast.success('Senha alterada com sucesso!')
    onLogin()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isChangingPassword) {
        handlePasswordChange()
      } else {
        handleLogin()
      }
    }
  }

  if (isChangingPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <FaLock className="text-primary" />
              Definir Nova Senha
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Por segurança, defina uma nova senha para acesso administrativo
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite a nova senha (mín. 6 caracteres)"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirme a nova senha"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <Button
              onClick={handlePasswordChange}
              className="w-full"
              disabled={!newPassword || !confirmPassword}
            >
              Definir Nova Senha
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <FaLock className="text-primary" />
            Acesso Administrativo
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            CT Mateus Pavanello - Painel Admin
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Usuário</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                onKeyPress={handleKeyPress}
                placeholder="Digite o usuário"
                className="pl-10"
              />
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                onKeyPress={handleKeyPress}
                placeholder="Digite a senha"
                className="pl-10 pr-10"
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <Button
            onClick={() => {
              console.log('Login button clicked')
              handleLogin()
            }}
            className="w-full"
            disabled={!credentials.username || !credentials.password}
          >
            Entrar
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Primeiro acesso? Use as credenciais padrão</p>
            <p className="font-mono bg-muted px-2 py-1 rounded mt-1">
              admin / Mateus##12
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
