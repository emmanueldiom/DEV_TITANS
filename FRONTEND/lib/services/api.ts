import axios, { AxiosError } from "axios";

// Configuration de base Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types pour l'API
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "PAYMENT" | "TRANSFER" | "CASH_OUT" | "DEBIT" | "CASH_IN";
  clientId: string;
  senderId: string;
  recipientId: string;
  fraudScore: number;
  status: "safe" | "suspicious" | "fraud";
  oldBalanceOrig: number;
  newBalanceOrig: number;
  oldBalanceDest: number;
  newBalanceDest: number;
}

export interface Alert {
  id: string;
  transactionId: string;
  date: string;
  severity: "high" | "medium" | "low";
  status: "pending" | "investigating" | "resolved" | "false_positive";
  description: string;
  assignedTo?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role:
    | "junior_analyst"
    | "senior_analyst"
    | "data_scientist"
    | "admin"
    | "compliance_officer";
  avatar?: string;
  status: "active" | "inactive";
  casesHandled: number;
}

export interface DailyStats {
  date: string;
  totalTransactions: number;
  fraudulentTransactions: number;
  fraudPercentage: number;
}

export interface FraudByType {
  type: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  totalTransactions: number;
  fraudulentTransactions: number;
  fraudPercentage: number;
  pendingAlerts: number;
  resolvedToday: number;
  avgResponseTime: string;
}

export interface PredictRequest {
  amount: number;
  oldbalanceOrg: number;
  newbalanceOrig: number;
  oldbalanceDest: number;
  newbalanceDest: number;
  type_CASH_IN: number;
  type_CASH_OUT: number;
  type_DEBIT: number;
  type_PAYMENT: number;
  type_TRANSFER: number;
}

export interface PredictResponse {
  prediction: number;
  probability: number;
  risk_level: "low" | "medium" | "high";
}

export interface ApiError {
  message: string;
  code?: string;
}

// Fonctions de service

/**
 * Récupère les statistiques du tableau de bord
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>("/dashboard/stats");
  return response.data;
}

/**
 * Récupère les transactions récentes
 */
export async function getTransactions(params?: {
  limit?: number;
  offset?: number;
  status?: Transaction["status"];
  search?: string;
}): Promise<Transaction[]> {
  const response = await api.get<Transaction[]>("/transactions", { params });
  return response.data;
}

/**
 * Récupère les détails d'une transaction
 */
export async function getTransactionById(id: string): Promise<Transaction> {
  const response = await api.get<Transaction>(`/transactions/${id}`);
  return response.data;
}

/**
 * Récupère les alertes de fraude
 */
export async function getAlerts(params?: {
  limit?: number;
  status?: Alert["status"];
  severity?: Alert["severity"];
}): Promise<Alert[]> {
  const response = await api.get<Alert[]>("/alerts", { params });
  return response.data;
}

/**
 * Recupere les statistiques des alertes
 */
export async function getAlertStats(): Promise<{
  pending: number;
  investigating: number;
  resolved: number;
  false_positive: number;
}> {
  const response = await api.get("/alerts/stats");
  return response.data;
}

/**
 * Met a jour le statut d'une alerte
 */
export async function updateAlertStatus(
  alertId: string,
  data: { status: Alert["status"]; assignedTo?: string },
): Promise<Alert> {
  const response = await api.patch<Alert>(`/alerts/${alertId}`, data);
  return response.data;
}

/**
 * Récupère les statistiques journalières
 */
export async function getDailyStats(days?: number): Promise<DailyStats[]> {
  const response = await api.get<DailyStats[]>("/analytics/daily", {
    params: { days: days || 7 },
  });
  return response.data;
}

/**
 * Récupère les fraudes par type de transaction
 */
export async function getFraudByType(): Promise<FraudByType[]> {
  const response = await api.get<FraudByType[]>("/analytics/fraud-by-type");
  return response.data;
}

/**
 * Récupère les membres de l'équipe
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const response = await api.get<TeamMember[]>("/team");
  return response.data;
}

/**
 * Met à jour un membre de l'équipe
 */
export async function updateTeamMember(
  memberId: string,
  data: Partial<TeamMember>,
): Promise<TeamMember> {
  const response = await api.patch<TeamMember>(`/team/${memberId}`, data);
  return response.data;
}

/**
 * Ajoute un nouveau membre à l'équipe
 */
export async function addTeamMember(
  data: Omit<TeamMember, "id" | "casesHandled">,
): Promise<TeamMember> {
  const response = await api.post<TeamMember>("/team", data);
  return response.data;
}

/**
 * Envoie une transaction pour prédiction de fraude
 */
export async function predictFraud(
  data: PredictRequest,
): Promise<PredictResponse> {
  const response = await api.post<PredictResponse>(
    "/predict-transaction",
    data,
  );
  return response.data;
}

/**
 * Connexion utilisateur
 */
export async function login(credentials: {
  email: string;
  password: string;
}): Promise<{
  token: string;
  user: { id: string; name: string; email: string; role: string };
}> {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

/**
 * Déconnexion utilisateur
 */
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

/**
 * Helper pour extraire le message d'erreur
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Une erreur est survenue"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur inattendue est survenue";
}

export default api;
