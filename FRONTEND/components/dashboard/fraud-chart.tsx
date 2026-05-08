'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFetch } from '@/hooks/use-fetch'
import { getDailyStats } from '@/lib/services/api'
import { ChartSkeleton } from '@/components/ui/skeleton-loaders'
import { ErrorState } from '@/components/ui/empty-states'

export function FraudChart() {
  const { data: dailyStats, loading, error, refetch } = useFetch(
    () => getDailyStats(7),
    []
  )

  const chartData = useMemo(() => {
    if (!dailyStats) return []
    return dailyStats.map((stat) => ({
      ...stat,
      dateLabel: format(new Date(stat.date), 'dd MMM', { locale: fr }),
    }))
  }, [dailyStats])

  if (loading) {
    return <ChartSkeleton />
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Tendance des Fraudes (7 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message={error} onRetry={refetch} className="h-[300px]" />
        </CardContent>
      </Card>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Tendance des Fraudes (7 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Aucune donnée disponible
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Tendance des Fraudes (7 derniers jours)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 250)" />
              <XAxis
                dataKey="dateLabel"
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.01 250)',
                  border: '1px solid oklch(0.28 0.01 250)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
                labelStyle={{ color: 'oklch(0.65 0 0)' }}
                formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Fraudes']}
              />
              <Area
                type="monotone"
                dataKey="fraudulentTransactions"
                stroke="oklch(0.55 0.22 25)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFraud)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
