'use client'

import { TeamTable } from '@/components/dashboard/team-table'
import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, Shield, Database, Scale } from 'lucide-react'
import { mockTeamMembers } from '@/lib/mock-data'

export default function TeamPage() {
  const roleStats = {
    analysts: mockTeamMembers.filter(m => m.role === 'junior_analyst' || m.role === 'senior_analyst').length,
    dataScientists: mockTeamMembers.filter(m => m.role === 'data_scientist').length,
    admins: mockTeamMembers.filter(m => m.role === 'admin').length,
    compliance: mockTeamMembers.filter(m => m.role === 'compliance_officer').length,
    active: mockTeamMembers.filter(m => m.status === 'active').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestion de l&apos;Équipe</h1>
        <p className="text-muted-foreground">
          Administrez les membres de l&apos;équipe et leurs rôles
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockTeamMembers.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <UserCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleStats.analysts}</p>
              <p className="text-sm text-muted-foreground">Analystes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-chart-4/10">
              <Database className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleStats.dataScientists}</p>
              <p className="text-sm text-muted-foreground">Data Scientists</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleStats.admins}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <Scale className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleStats.compliance}</p>
              <p className="text-sm text-muted-foreground">Conformité</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Table */}
      <TeamTable />
    </div>
  )
}
