'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useFetch } from '@/hooks/use-fetch'
import { getDailyStats, getFraudByType } from '@/lib/services/api'
import { AnalyticsChartSkeleton } from '@/components/ui/skeleton-loaders'
import { ErrorState } from '@/components/ui/empty-states'

const COLORS = [
  'oklch(0.55 0.22 25)', // destructive - CASH_OUT
  'oklch(0.65 0.15 220)', // primary - TRANSFER
  'oklch(0.55 0.18 180)', // accent - PAYMENT
  'oklch(0.75 0.15 85)', // warning - DEBIT
  'oklch(0.65 0.2 145)', // success - CASH_IN
]

export function TransactionVolumeChart() {
  const { data: dailyStats, loading, error, refetch } = useFetch(() => getDailyStats(7), [])

  const chartData = useMemo(() => {
    if (!dailyStats) return []
    return dailyStats.map((stat) => ({
      ...stat,
      dateLabel: format(new Date(stat.date), 'dd MMM', { locale: fr }),
    }))
  }, [dailyStats])

  if (loading) return <AnalyticsChartSkeleton />
  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Volume de Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message={error} onRetry={refetch} className="h-[350px]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Volume de Transactions
        </CardTitle>
        <CardDescription>Comparaison des transactions totales vs frauduleuses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.15 220)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.15 220)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFraudArea" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.01 250)',
                  border: '1px solid oklch(0.28 0.01 250)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
                formatter={(value: number, name: string) => [
                  value.toLocaleString('fr-FR'),
                  name === 'totalTransactions' ? 'Total' : 'Fraudes',
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === 'totalTransactions' ? 'Transactions totales' : 'Fraudes détectées'
                }
              />
              <Area
                type="monotone"
                dataKey="totalTransactions"
                stroke="oklch(0.65 0.15 220)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="fraudulentTransactions"
                stroke="oklch(0.55 0.22 25)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFraudArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function FraudByTypeChart() {
  const { data: fraudByType, loading, error, refetch } = useFetch(getFraudByType, [])

  const pieChartData = useMemo(() => {
    if (!fraudByType) return []
    return fraudByType.map((item, index) => ({
      name: item.type,
      value: item.count,
      color: COLORS[index % COLORS.length],
    }))
  }, [fraudByType])

  if (loading) return <AnalyticsChartSkeleton />
  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Fraudes par Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message={error} onRetry={refetch} className="h-[350px]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Fraudes par Type
        </CardTitle>
        <CardDescription>Répartition des fraudes selon le type de transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.01 250)',
                  border: '1px solid oklch(0.28 0.01 250)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
                formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Fraudes']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function FraudRateChart() {
  const { data: dailyStats, loading, error, refetch } = useFetch(() => getDailyStats(7), [])

  const chartData = useMemo(() => {
    if (!dailyStats) return []
    return dailyStats.map((stat) => ({
      ...stat,
      dateLabel: format(new Date(stat.date), 'dd MMM', { locale: fr }),
    }))
  }, [dailyStats])

  if (loading) return <AnalyticsChartSkeleton />
  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Taux de Fraude Journalier</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message={error} onRetry={refetch} className="h-[350px]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Taux de Fraude Journalier
        </CardTitle>
        <CardDescription>Pourcentage de transactions frauduleuses par jour</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.01 250)',
                  border: '1px solid oklch(0.28 0.01 250)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Taux de fraude']}
              />
              <Bar dataKey="fraudPercentage" fill="oklch(0.55 0.22 25)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function FraudComparisonChart() {
  const { data: fraudByType, loading, error, refetch } = useFetch(getFraudByType, [])

  const barData = useMemo(() => {
    if (!fraudByType) return []
    return fraudByType.map((item) => ({
      name: item.type,
      Fraudes: item.count,
    }))
  }, [fraudByType])

  if (loading) return <AnalyticsChartSkeleton />
  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Comparaison par Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message={error} onRetry={refetch} className="h-[350px]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Comparaison par Type
        </CardTitle>
        <CardDescription>Nombre de fraudes détectées par type de transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 250)" />
              <XAxis
                type="number"
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.01 250)',
                  border: '1px solid oklch(0.28 0.01 250)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
                formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Fraudes']}
              />
              <Bar dataKey="Fraudes" fill="oklch(0.65 0.15 220)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
