'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { AlertTriangle, Clock, CheckCircle, XCircle, User, ChevronRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFetch, useMutation } from '@/hooks/use-fetch'
import {
  getAlerts,
  getTeamMembers,
  updateAlertStatus,
  type Alert,
} from '@/lib/services/api'
import { alertStatusLabels } from '@/lib/mock-data'
import { AlertsPanelSkeleton } from '@/components/ui/skeleton-loaders'
import { NoAlerts, ErrorState } from '@/components/ui/empty-states'
import { cn } from '@/lib/utils'

function SeverityIcon({ severity }: { severity: Alert['severity'] }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-lg',
        severity === 'high' && 'bg-destructive/20',
        severity === 'medium' && 'bg-warning/20',
        severity === 'low' && 'bg-muted'
      )}
    >
      <AlertTriangle
        className={cn(
          'w-5 h-5',
          severity === 'high' && 'text-destructive',
          severity === 'medium' && 'text-warning',
          severity === 'low' && 'text-muted-foreground'
        )}
      />
    </div>
  )
}

function StatusIcon({ status }: { status: Alert['status'] }) {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-warning" />
    case 'investigating':
      return <User className="w-4 h-4 text-primary" />
    case 'resolved':
      return <CheckCircle className="w-4 h-4 text-success" />
    case 'false_positive':
      return <XCircle className="w-4 h-4 text-muted-foreground" />
  }
}

export function AlertsPanel({ limit }: { limit?: number }) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [alertStatus, setAlertStatus] = useState<Alert['status']>('pending')
  const [assignedTo, setAssignedTo] = useState<string>('')

  const { data: alerts, loading, error, refetch } = useFetch(
    () => getAlerts({ limit }),
    [limit]
  )

  const { data: teamMembers } = useFetch(getTeamMembers, [])

  const updateMutation = useMutation((params: { alertId: string; status: Alert['status']; assignedTo?: string }) =>
    updateAlertStatus(params.alertId, { status: params.status, assignedTo: params.assignedTo })
  )

  const handleOpenAlert = (alert: Alert) => {
    setSelectedAlert(alert)
    setAlertStatus(alert.status)
    setAssignedTo(alert.assignedTo || '')
  }

  const handleUpdateStatus = async () => {
    if (!selectedAlert) return
    const result = await updateMutation.mutate({
      alertId: selectedAlert.id,
      status: alertStatus,
      assignedTo: assignedTo || undefined,
    })
    if (result) {
      setSelectedAlert(null)
      refetch()
    }
  }

  const pendingCount = alerts?.filter((a) => a.status === 'pending').length || 0

  if (loading) {
    return <AlertsPanelSkeleton count={limit || 5} />
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-8">
          <ErrorState message={error} onRetry={refetch} />
        </CardContent>
      </Card>
    )
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Alertes de Fraude
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NoAlerts onRefresh={refetch} />
        </CardContent>
      </Card>
    )
  }

  const analysts = teamMembers?.filter(
    (m) => m.role === 'junior_analyst' || m.role === 'senior_analyst'
  ) || []

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Alertes de Fraude
          </CardTitle>
          <Badge variant="destructive" className="bg-destructive/20 text-destructive">
            {pendingCount} en attente
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => handleOpenAlert(alert)}
            >
              <SeverityIcon severity={alert.severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-primary">{alert.transactionId}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      alert.severity === 'high' && 'border-destructive text-destructive',
                      alert.severity === 'medium' && 'border-warning text-warning',
                      alert.severity === 'low' && 'border-muted-foreground text-muted-foreground'
                    )}
                  >
                    {alert.severity === 'high' && 'Critique'}
                    {alert.severity === 'medium' && 'Moyen'}
                    {alert.severity === 'low' && 'Faible'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{alert.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <StatusIcon status={alert.status} />
                    <span>{alertStatusLabels[alert.status]}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(alert.date), 'dd MMM HH:mm', { locale: fr })}
                  </span>
                  {alert.assignedTo && (
                    <span className="text-xs text-primary">{alert.assignedTo}</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alert Details Modal */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <AlertTriangle
                className={cn(
                  'w-5 h-5',
                  selectedAlert?.severity === 'high' && 'text-destructive',
                  selectedAlert?.severity === 'medium' && 'text-warning'
                )}
              />
              Alerte {selectedAlert?.id}
            </DialogTitle>
            <DialogDescription>Transaction {selectedAlert?.transactionId}</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{selectedAlert.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sévérité</p>
                  <Badge
                    className={cn(
                      selectedAlert.severity === 'high' && 'bg-destructive/20 text-destructive',
                      selectedAlert.severity === 'medium' && 'bg-warning/20 text-warning',
                      selectedAlert.severity === 'low' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {selectedAlert.severity === 'high' && 'Critique'}
                    {selectedAlert.severity === 'medium' && 'Moyen'}
                    {selectedAlert.severity === 'low' && 'Faible'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="text-sm">
                    {format(new Date(selectedAlert.date), 'PPpp', { locale: fr })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Mettre à jour le statut</p>
                <Select
                  value={alertStatus}
                  onValueChange={(value) => setAlertStatus(value as Alert['status'])}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="investigating">En cours d&apos;investigation</SelectItem>
                    <SelectItem value="resolved">Résolu - Vrai positif</SelectItem>
                    <SelectItem value="false_positive">Résolu - Faux positif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Assigner à</p>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Sélectionner un analyste" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {analysts.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {updateMutation.error && (
                <p className="text-sm text-destructive">{updateMutation.error}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAlert(null)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updateMutation.loading}>
              {updateMutation.loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                'Mettre à jour'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
