'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function KPICardSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="w-12 h-12 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-4 w-28 ml-auto" />
      <Skeleton className="h-4 w-16" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-2 w-20 rounded-full" />
        <Skeleton className="h-4 w-8" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  )
}

export function TransactionsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <Skeleton className="h-6 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-48 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {[...Array(rows)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AlertItemSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-4 mt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  )
}

export function AlertsPanelSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-6 w-36" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <AlertItemSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  )
}

export function ChartSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <Skeleton className="h-6 w-64" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-end justify-between gap-2 p-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <Skeleton
                className="w-full rounded-t"
                style={{ height: `${Math.random() * 60 + 40}%` }}
              />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TeamTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-6 w-36 rounded-full ml-auto" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsChartSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[350px] w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}
