'use client'

import { useState } from 'react'
import { User, Edit, MoreHorizontal, Shield, Database, UserCheck, Scale, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFetch, useMutation } from '@/hooks/use-fetch'
import { getTeamMembers, updateTeamMember, type TeamMember } from '@/lib/services/api'
import { roleLabels } from '@/lib/mock-data'
import { TeamTableSkeleton } from '@/components/ui/skeleton-loaders'
import { NoTeamMembers, ErrorState } from '@/components/ui/empty-states'
import { cn } from '@/lib/utils'

function RoleIcon({ role }: { role: TeamMember['role'] }) {
  const icons = {
    junior_analyst: User,
    senior_analyst: UserCheck,
    data_scientist: Database,
    admin: Shield,
    compliance_officer: Scale,
  }
  const Icon = icons[role]
  return <Icon className="w-4 h-4" />
}

function RoleBadge({ role }: { role: TeamMember['role'] }) {
  const colors = {
    junior_analyst: 'bg-primary/20 text-primary',
    senior_analyst: 'bg-accent/20 text-accent',
    data_scientist: 'bg-chart-4/20 text-chart-4',
    admin: 'bg-destructive/20 text-destructive',
    compliance_officer: 'bg-success/20 text-success',
  }

  return (
    <Badge className={cn('flex items-center gap-1.5', colors[role])}>
      <RoleIcon role={role} />
      {roleLabels[role]}
    </Badge>
  )
}

export function TeamTable() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState<TeamMember['role']>('junior_analyst')

  const { data: teamMembers, loading, error, refetch } = useFetch(getTeamMembers, [])

  const updateMutation = useMutation((params: { memberId: string; data: Partial<TeamMember> }) =>
    updateTeamMember(params.memberId, params.data)
  )

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member)
    setEditName(member.name)
    setEditEmail(member.email)
    setEditRole(member.role)
  }

  const handleSave = async () => {
    if (!selectedMember) return
    const result = await updateMutation.mutate({
      memberId: selectedMember.id,
      data: {
        name: editName,
        email: editEmail,
        role: editRole,
      },
    })
    if (result) {
      setSelectedMember(null)
      refetch()
    }
  }

  if (loading) {
    return <TeamTableSkeleton rows={5} />
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

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Gestion de l&apos;Équipe
          </CardTitle>
          <Button size="sm">
            <User className="w-4 h-4 mr-2" />
            Ajouter un membre
          </Button>
        </CardHeader>
        <CardContent>
          <NoTeamMembers onRefresh={refetch} />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Gestion de l&apos;Équipe
          </CardTitle>
          <Button size="sm">
            <User className="w-4 h-4 mr-2" />
            Ajouter un membre
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Membre</TableHead>
                  <TableHead className="text-muted-foreground">Rôle</TableHead>
                  <TableHead className="text-muted-foreground">Statut</TableHead>
                  <TableHead className="text-muted-foreground text-right">Cas traités</TableHead>
                  <TableHead className="text-muted-foreground sr-only">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                          <span className="text-sm font-semibold">
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={member.role} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          member.status === 'active'
                            ? 'border-success text-success'
                            : 'border-muted-foreground text-muted-foreground'
                        )}
                      >
                        {member.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{member.casesHandled}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem onClick={() => handleEdit(member)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Member Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Modifier le membre</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={editRole}
                  onValueChange={(value) => setEditRole(value as TeamMember['role'])}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="junior_analyst">Analyste Fraude Junior</SelectItem>
                    <SelectItem value="senior_analyst">Analyste Fraude Senior</SelectItem>
                    <SelectItem value="data_scientist">Data Scientist</SelectItem>
                    <SelectItem value="admin">Administrateur Système</SelectItem>
                    <SelectItem value="compliance_officer">Responsable Conformité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {updateMutation.error && (
                <p className="text-sm text-destructive">{updateMutation.error}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMember(null)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.loading}>
              {updateMutation.loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
