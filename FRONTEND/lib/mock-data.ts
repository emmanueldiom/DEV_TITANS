// Types et constantes pour FraudShield
// Les données réelles proviennent maintenant de l'API

// Re-export types from API service
export type {
  Transaction,
  Alert,
  TeamMember,
  DailyStats,
  DashboardStats,
  FraudByType,
} from '@/lib/services/api'

import type { Transaction, Alert, TeamMember } from '@/lib/services/api'

// Labels de rôles
export const roleLabels: Record<TeamMember['role'], string> = {
  junior_analyst: 'Analyste Fraude Junior',
  senior_analyst: 'Analyste Fraude Senior',
  data_scientist: 'Data Scientist',
  admin: 'Administrateur Système',
  compliance_officer: 'Responsable Conformité',
}

// Labels de statut d'alerte
export const alertStatusLabels: Record<Alert['status'], string> = {
  pending: 'En attente',
  investigating: 'En cours',
  resolved: 'Résolu',
  false_positive: 'Faux positif',
}

// Labels de type de transaction
export const transactionTypeLabels: Record<Transaction['type'], string> = {
  PAYMENT: 'Paiement',
  TRANSFER: 'Transfert',
  CASH_OUT: 'Retrait',
  DEBIT: 'Débit',
  CASH_IN: 'Dépôt',
}

// Données mock pour l'équipe
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Dupont',
    email: 'alice.dupont@fraudshield.com',
    role: 'senior_analyst',
    status: 'active',
    casesHandled: 245,
  },
  {
    id: '2',
    name: 'Bob Martin',
    email: 'bob.martin@fraudshield.com',
    role: 'data_scientist',
    status: 'active',
    casesHandled: 189,
  },
  {
    id: '3',
    name: 'Claire Bernard',
    email: 'claire.bernard@fraudshield.com',
    role: 'junior_analyst',
    status: 'active',
    casesHandled: 67,
  },
  {
    id: '4',
    name: 'David Petit',
    email: 'david.petit@fraudshield.com',
    role: 'admin',
    status: 'active',
    casesHandled: 12,
  },
  {
    id: '5',
    name: 'Emma Moreau',
    email: 'emma.moreau@fraudshield.com',
    role: 'compliance_officer',
    status: 'active',
    casesHandled: 98,
  },
  {
    id: '6',
    name: 'François Roux',
    email: 'francois.roux@fraudshield.com',
    role: 'senior_analyst',
    status: 'inactive',
    casesHandled: 312,
  },
]
