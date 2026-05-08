'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronRight, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useFetch } from '@/hooks/use-fetch'
import { getTransactions, type Transaction } from '@/lib/services/api'
import { transactionTypeLabels } from '@/lib/mock-data'
import { TransactionsTableSkeleton } from '@/components/ui/skeleton-loaders'
import { NoTransactions, ErrorState } from '@/components/ui/empty-states'
import { cn } from '@/lib/utils'

function StatusBadge({ status }: { status: Transaction['status'] }) {
  return (
    <Badge
      className={cn(
        'font-medium',
        status === 'safe' && 'bg-success/20 text-success hover:bg-success/30',
        status === 'suspicious' && 'bg-warning/20 text-warning hover:bg-warning/30',
        status === 'fraud' && 'bg-destructive/20 text-destructive hover:bg-destructive/30'
      )}
    >
      {status === 'safe' && 'Sûr'}
      {status === 'suspicious' && 'Suspect'}
      {status === 'fraud' && 'Fraude'}
    </Badge>
  )
}

function FraudScoreBar({ score }: { score: number }) {
  const percentage = Math.round(score * 100)

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            score < 0.3 && 'bg-success',
            score >= 0.3 && score < 0.7 && 'bg-warning',
            score >= 0.7 && 'bg-destructive'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-mono text-muted-foreground">{percentage}%</span>
    </div>
  )
}

export function TransactionsTable({ limit }: { limit?: number }) {
  const [search, setSearch] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const { data: transactions, loading, error, refetch } = useFetch(
    () => getTransactions({ limit: limit || 50 }),
    [limit]
  )

  const filteredTransactions = useMemo(() => {
    if (!transactions) return []
    return transactions.filter(
      (tx) =>
        tx.id.toLowerCase().includes(search.toLowerCase()) ||
        tx.clientId.toLowerCase().includes(search.toLowerCase()) ||
        tx.senderId.toLowerCase().includes(search.toLowerCase())
    )
  }, [transactions, search])

  if (loading) {
    return <TransactionsTableSkeleton rows={limit || 5} />
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

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Transactions Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NoTransactions onRefresh={refetch} />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Transactions Récentes
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-48 bg-input border-border"
              />
            </div>
            <Button variant="outline" size="icon" className="border-border">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground text-right">Montant</TableHead>
                  <TableHead className="text-muted-foreground">Client</TableHead>
                  <TableHead className="text-muted-foreground">Score Fraude</TableHead>
                  <TableHead className="text-muted-foreground">Statut</TableHead>
                  <TableHead className="text-muted-foreground sr-only">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="border-border cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(transaction.date), 'dd MMM HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border">
                        {transactionTypeLabels[transaction.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {transaction.amount.toLocaleString('fr-FR')} FCFA
                    </TableCell>
                    <TableCell className="text-muted-foreground">{transaction.clientId}</TableCell>
                    <TableCell>
                      <FraudScoreBar score={transaction.fraudScore} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>Transaction {selectedTransaction?.id}</span>
              {selectedTransaction && <StatusBadge status={selectedTransaction.status} />}
            </DialogTitle>
            <DialogDescription>Détails complets de la transaction</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date &amp; Heure</p>
                  <p className="font-medium">
                    {format(new Date(selectedTransaction.date), 'PPpp', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type de transaction</p>
                  <p className="font-medium">{transactionTypeLabels[selectedTransaction.type]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Montant</p>
                  <p className="font-medium text-lg">
                    {selectedTransaction.amount.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Score de fraude</p>
                  <div className="mt-1">
                    <FraudScoreBar score={selectedTransaction.fraudScore} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID Client</p>
                  <p className="font-mono">{selectedTransaction.clientId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expéditeur</p>
                  <p className="font-mono">{selectedTransaction.senderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destinataire</p>
                  <p className="font-mono">{selectedTransaction.recipientId}</p>
                </div>
              </div>
              <div className="col-span-2 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-3">Soldes des comptes</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">Compte source</p>
                    <div className="flex justify-between">
                      <span className="text-sm">Avant:</span>
                      <span className="font-mono text-sm">
                        {selectedTransaction.oldBalanceOrig.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Après:</span>
                      <span className="font-mono text-sm">
                        {selectedTransaction.newBalanceOrig.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">Compte destination</p>
                    <div className="flex justify-between">
                      <span className="text-sm">Avant:</span>
                      <span className="font-mono text-sm">
                        {selectedTransaction.oldBalanceDest.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Après:</span>
                      <span className="font-mono text-sm">
                        {selectedTransaction.newBalanceDest.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
