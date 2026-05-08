'use client'

import { AnalyzeForm } from '@/components/dashboard/analyze-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Shield, Zap, Info } from 'lucide-react'

export default function AnalyzePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analyser une Transaction</h1>
        <p className="text-muted-foreground">
          Soumettez manuellement une transaction pour obtenir une prédiction de fraude en temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="xl:col-span-2">
          <AnalyzeForm />
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Comment ça fonctionne
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Notre modèle de Machine Learning analyse les caractéristiques de la transaction pour détecter les patterns frauduleux.
              </p>
              <p>
                Les facteurs pris en compte incluent le montant, le type de transaction, et les variations de solde.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                Indicateurs de risque
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-destructive/10">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium">Retraits importants</p>
                  <p className="text-xs text-muted-foreground">
                    CASH_OUT avec montants élevés
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-warning/10">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium">Vidange de compte</p>
                  <p className="text-xs text-muted-foreground">
                    {'Solde final < 10% du solde initial'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-success/10">
                  <Shield className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">Transactions normales</p>
                  <p className="text-xs text-muted-foreground">
                    Paiements réguliers de faibles montants
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    API Backend
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cette interface est configurée pour appeler l&apos;endpoint <code className="text-primary">http://localhost:5000/predict</code>. Si l&apos;API n&apos;est pas disponible, une simulation sera utilisée.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
