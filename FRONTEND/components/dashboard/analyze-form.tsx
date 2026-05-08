'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Loader2, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMutation } from '@/hooks/use-fetch'
import { predictFraud, type PredictRequest, type PredictResponse } from '@/lib/services/api'
import { cn } from '@/lib/utils'

interface TransactionInput {
  amount: string
  oldBalanceOrig: string
  newBalanceOrig: string
  oldBalanceDest: string
  newBalanceDest: string
  type: string
}

interface PredictionResult {
  isFraud: boolean
  probability: number
  riskLevel: string
}

const initialFormState: TransactionInput = {
  amount: '',
  oldBalanceOrig: '',
  newBalanceOrig: '',
  oldBalanceDest: '',
  newBalanceDest: '',
  type: '',
}

const transactionTypes = [
  { value: 'PAYMENT', label: 'Paiement' },
  { value: 'TRANSFER', label: 'Transfert' },
  { value: 'CASH_OUT', label: 'Retrait' },
  { value: 'DEBIT', label: 'Débit' },
  { value: 'CASH_IN', label: 'Dépôt' },
]

export function AnalyzeForm() {
  const [formData, setFormData] = useState<TransactionInput>(initialFormState)
  const [result, setResult] = useState<PredictionResult | null>(null)

  const predictMutation = useMutation(async (data: PredictRequest): Promise<PredictResponse> => {
    return predictFraud(data)
  })

  const handleInputChange = (field: keyof TransactionInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setResult(null)
    predictMutation.reset()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)

    // Prepare data for API - matching the ClaimData model from api.py
    const payload: PredictRequest = {
      amount: parseFloat(formData.amount) || 0,
      oldbalanceOrg: parseFloat(formData.oldBalanceOrig) || 0,
      newbalanceOrig: parseFloat(formData.newBalanceOrig) || 0,
      oldbalanceDest: parseFloat(formData.oldBalanceDest) || 0,
      newbalanceDest: parseFloat(formData.newBalanceDest) || 0,
      type_CASH_IN: formData.type === 'CASH_IN' ? 1 : 0,
      type_CASH_OUT: formData.type === 'CASH_OUT' ? 1 : 0,
      type_DEBIT: formData.type === 'DEBIT' ? 1 : 0,
      type_PAYMENT: formData.type === 'PAYMENT' ? 1 : 0,
      type_TRANSFER: formData.type === 'TRANSFER' ? 1 : 0,
    }

    const response = await predictMutation.mutate(payload)

    if (response) {
      setResult({
        isFraud: response.prediction === 1,
        probability: response.probability,
        riskLevel: response.risk_level === 'high' ? 'Haut' : response.risk_level === 'medium' ? 'Moyen' : 'Faible',
      })
    }
  }

  const handleReset = () => {
    setFormData(initialFormState)
    setResult(null)
    predictMutation.reset()
  }

  const isFormValid = formData.type && formData.amount

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-card-foreground">
          Analyser une Transaction
        </CardTitle>
        <CardDescription>
          Soumettez les détails d&apos;une transaction pour obtenir une prédiction de fraude en
          temps réel via l&apos;API /predict.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type de transaction *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {transactionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {/* Old Balance Origin */}
            <div className="space-y-2">
              <Label htmlFor="oldBalanceOrig">Solde initial (Origine)</Label>
              <Input
                id="oldBalanceOrig"
                type="number"
                placeholder="0"
                value={formData.oldBalanceOrig}
                onChange={(e) => handleInputChange('oldBalanceOrig', e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {/* New Balance Origin */}
            <div className="space-y-2">
              <Label htmlFor="newBalanceOrig">Solde final (Origine)</Label>
              <Input
                id="newBalanceOrig"
                type="number"
                placeholder="0"
                value={formData.newBalanceOrig}
                onChange={(e) => handleInputChange('newBalanceOrig', e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {/* Old Balance Destination */}
            <div className="space-y-2">
              <Label htmlFor="oldBalanceDest">Solde initial (Destination)</Label>
              <Input
                id="oldBalanceDest"
                type="number"
                placeholder="0"
                value={formData.oldBalanceDest}
                onChange={(e) => handleInputChange('oldBalanceDest', e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {/* New Balance Destination */}
            <div className="space-y-2">
              <Label htmlFor="newBalanceDest">Solde final (Destination)</Label>
              <Input
                id="newBalanceDest"
                type="number"
                placeholder="0"
                value={formData.newBalanceDest}
                onChange={(e) => handleInputChange('newBalanceDest', e.target.value)}
                className="bg-input border-border"
              />
            </div>
          </div>

          {/* Error Message */}
          {predictMutation.error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{predictMutation.error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div
              className={cn(
                'p-6 rounded-lg border',
                result.isFraud
                  ? 'bg-destructive/10 border-destructive/30'
                  : 'bg-success/10 border-success/30'
              )}
            >
              <div className="flex items-center gap-4">
                {result.isFraud ? (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/20">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/20">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                )}
                <div>
                  <h3
                    className={cn(
                      'text-lg font-semibold',
                      result.isFraud ? 'text-destructive' : 'text-success'
                    )}
                  >
                    {result.isFraud ? 'Transaction Suspecte' : 'Transaction Sûre'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Probabilité de fraude: {(result.probability * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Niveau de risque: {result.riskLevel}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={predictMutation.loading || !isFormValid}>
              {predictMutation.loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Analyser
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
