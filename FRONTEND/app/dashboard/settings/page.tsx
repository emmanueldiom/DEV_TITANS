'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/lib/auth-context'
import { Bell, Moon, Shield, Globe, Key, Mail } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos préférences et les configurations du compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Profil
            </CardTitle>
            <CardDescription>
              Vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                defaultValue={user?.name}
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                className="bg-input border-border"
              />
            </div>
            <Button>Enregistrer les modifications</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="w-5 h-5 text-warning" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Gérez la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input
                id="current-password"
                type="password"
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                className="bg-input border-border"
              />
            </div>
            <Button>Changer le mot de passe</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Alertes de fraude</p>
                <p className="text-xs text-muted-foreground">
                  Recevoir une notification pour chaque alerte critique
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Résumé quotidien</p>
                <p className="text-xs text-muted-foreground">
                  Recevoir un résumé des activités chaque jour
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notifications par email</p>
                <p className="text-xs text-muted-foreground">
                  Recevoir les alertes par email
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l&apos;interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Mode sombre</p>
                <p className="text-xs text-muted-foreground">
                  Utiliser le thème sombre (activé par défaut)
                </p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Animations</p>
                <p className="text-xs text-muted-foreground">
                  Activer les animations de l&apos;interface
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-success" />
              Configuration API
            </CardTitle>
            <CardDescription>
              Paramètres de connexion à l&apos;API backend de détection de fraude
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">URL de l&apos;API</Label>
                <Input
                  id="api-url"
                  defaultValue="http://localhost:5000"
                  className="bg-input border-border font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">Endpoint de prédiction</Label>
                <Input
                  id="api-endpoint"
                  defaultValue="/predict"
                  className="bg-input border-border font-mono text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Button variant="outline">Tester la connexion</Button>
              <Button>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
