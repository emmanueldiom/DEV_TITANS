'use client'

import { AlertCircle, FileX, Users, Activity, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function NoTransactions({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      title="Aucune transaction"
      description="Aucune transaction n'a été trouvée pour les critères sélectionnés."
      icon={<FileX className="w-8 h-8 text-muted-foreground" />}
      action={onRefresh ? { label: 'Actualiser', onClick: onRefresh } : undefined}
    />
  )
}

export function NoAlerts({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      title="Aucune alerte"
      description="Aucune alerte de fraude n'est en attente. Tout semble normal!"
      icon={<Activity className="w-8 h-8 text-success" />}
      action={onRefresh ? { label: 'Actualiser', onClick: onRefresh } : undefined}
    />
  )
}

export function NoTeamMembers({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      title="Aucun membre"
      description="Aucun membre n'a été ajouté à l'équipe pour le moment."
      icon={<Users className="w-8 h-8 text-muted-foreground" />}
      action={onRefresh ? { label: 'Actualiser', onClick: onRefresh } : undefined}
    />
  )
}

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ title = 'Erreur', message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      )}
    </div>
  )
}
