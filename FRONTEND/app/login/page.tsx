'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Loader2, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    const success = await login(email, password)
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Identifiants incorrects')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">FraudShield</h1>
            <p className="text-sm text-muted-foreground">Détection de fraude mobile</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-card border-border">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder au tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@fraudshield.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input border-border"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-input border-border"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>

              {/* Demo credentials */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-center text-muted-foreground mb-2">
                  Identifiants de démonstration
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      setEmail('demo@fraudshield.com')
                      setPassword('demo123')
                    }}
                  >
                    Utiliser les identifiants
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 FraudShield. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
