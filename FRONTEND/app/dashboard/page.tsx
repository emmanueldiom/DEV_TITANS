'use client'

import { KPICards } from '@/components/dashboard/kpi-cards'
import { TransactionsTable } from '@/components/dashboard/transactions-table'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { FraudChart } from '@/components/dashboard/fraud-chart'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenue, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de l&apos;activité de détection de fraude
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Charts and Alerts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <FraudChart />
        </div>
        <div className="xl:col-span-1">
          <AlertsPanel limit={3} />
        </div>
      </div>

      {/* Recent Transactions */}
      <TransactionsTable limit={7} />
    </div>
  )
}
