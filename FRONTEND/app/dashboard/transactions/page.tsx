'use client'

import { TransactionsTable } from '@/components/dashboard/transactions-table'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground">
          Consultez et analysez toutes les transactions traitées par le système
        </p>
      </div>

      {/* Transactions Table */}
      <TransactionsTable />
    </div>
  )
}
