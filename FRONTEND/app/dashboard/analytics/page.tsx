'use client'

import {
  TransactionVolumeChart,
  FraudByTypeChart,
  FraudRateChart,
  FraudComparisonChart,
} from '@/components/dashboard/analytics-charts'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytique</h1>
        <p className="text-muted-foreground">
          Visualisations approfondies des tendances de fraude et des performances du système
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TransactionVolumeChart />
        <FraudByTypeChart />
        <FraudRateChart />
        <FraudComparisonChart />
      </div>
    </div>
  )
}
