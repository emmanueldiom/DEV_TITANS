'use client'

import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'
import { getAlertStats } from '@/lib/services/api'
import { Skeleton } from '@/components/ui/skeleton'

interface AlertStats {
  pending: number
  investigating: number
  resolved: number
  false_positive: number
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <Skeleton className="w-11 h-11 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function AlertsPage() {
  const { data: stats, loading } = useFetch<AlertStats>(getAlertStats)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alertes de Fraude</h1>
        <p className="text-muted-foreground">
          Gerez et traitez les alertes generees par le systeme de detection
        </p>
      </div>

      {/* Alert Stats */}
      {loading || !stats ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.investigating}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolues</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.false_positive}</p>
                <p className="text-sm text-muted-foreground">Faux positifs</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Alerts */}
      <AlertsPanel />
    </div>
  )
}
