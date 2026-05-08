'use client'

import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useFetch } from '@/hooks/use-fetch'
import { getDashboardStats, type DashboardStats } from '@/lib/services/api'
import { KPICardsSkeleton } from '@/components/ui/skeleton-loaders'
import { ErrorState } from '@/components/ui/empty-states'

interface KPIConfig {
  key: keyof DashboardStats
  title: string
  formatValue: (stats: DashboardStats) => string
  getChange: (stats: DashboardStats) => string
  trend: 'up' | 'down'
  icon: typeof Activity
  color: string
  bgColor: string
}

const kpiConfigs: KPIConfig[] = [
  {
    key: 'totalTransactions',
    title: 'Transactions Analysées',
    formatValue: (stats) => stats.totalTransactions.toLocaleString('fr-FR'),
    getChange: () => '+12.5%',
    trend: 'up',
    icon: Activity,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    key: 'fraudulentTransactions',
    title: 'Fraudes Détectées',
    formatValue: (stats) => stats.fraudulentTransactions.toLocaleString('fr-FR'),
    getChange: (stats) => `${stats.fraudPercentage}%`,
    trend: 'down',
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    key: 'pendingAlerts',
    title: 'Alertes en Attente',
    formatValue: (stats) => stats.pendingAlerts.toString(),
    getChange: () => '-3',
    trend: 'down',
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    key: 'resolvedToday',
    title: "Résolues Aujourd'hui",
    formatValue: (stats) => stats.resolvedToday.toString(),
    getChange: () => '+8',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
]

export function KPICards() {
  const { data: stats, loading, error, refetch } = useFetch(getDashboardStats, [])

  if (loading) {
    return <KPICardsSkeleton />
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={refetch}
        className="bg-card border border-border rounded-lg"
      />
    )
  }

  if (!stats) {
    return <KPICardsSkeleton />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiConfigs.map((kpi) => (
        <Card key={kpi.key} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-3xl font-bold text-card-foreground">
                  {kpi.formatValue(stats)}
                </p>
                <div className="flex items-center gap-1">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-success" />
                  )}
                  <span className="text-sm text-success">{kpi.getChange(stats)}</span>
                  <span className="text-sm text-muted-foreground">vs hier</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
