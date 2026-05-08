
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import random

app = FastAPI(title="FraudShield AI", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("fraud_model.pkl")
le    = joblib.load("label_encoder.pkl")
feats = joblib.load("features_list.pkl")

class ClaimData(BaseModel):
    age_compte_mois: int
    nb_sinistres_12m: int
    montant_fcfa: int
    type_sinistre: str
    nb_docs_fournis: int
    delai_declaration_jours: int
    sinistres_similaires: int

class PredictRequest(BaseModel):
    amount: float
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float
    type_CASH_IN: int
    type_CASH_OUT: int
    type_DEBIT: int
    type_PAYMENT: int
    type_TRANSFER: int

class Transaction(BaseModel):
    id: str
    date: str
    amount: float
    type: str
    clientId: str
    senderId: str
    recipientId: str
    fraudScore: int
    status: str
    oldBalanceOrig: float
    newBalanceOrig: float
    oldBalanceDest: float
    newBalanceDest: float

class Alert(BaseModel):
    id: str
    transactionId: str
    date: str
    severity: str
    status: str
    description: str
    assignedTo: Optional[str] = None

class TeamMember(BaseModel):
    id: str
    name: str
    email: str
    role: str
    status: str
    casesHandled: int

class DailyStats(BaseModel):
    date: str
    totalTransactions: int
    fraudulentTransactions: int
    fraudPercentage: float

class FraudByType(BaseModel):
    type: str
    count: int
    percentage: float

class DashboardStats(BaseModel):
    totalTransactions: int
    fraudulentTransactions: int
    fraudPercentage: float
    pendingAlerts: int
    resolvedToday: int
    avgResponseTime: str

# Mock data
mock_transactions = [
    Transaction(
        id=f"txn_{i}",
        date=(datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
        amount=random.uniform(100, 10000),
        type=random.choice(["PAYMENT", "TRANSFER", "CASH_OUT", "DEBIT", "CASH_IN"]),
        clientId=f"client_{random.randint(1, 100)}",
        senderId=f"sender_{random.randint(1, 100)}",
        recipientId=f"recipient_{random.randint(1, 100)}",
        fraudScore=random.randint(0, 100),
        status=random.choice(["safe", "suspicious", "fraud"]),
        oldBalanceOrig=random.uniform(0, 50000),
        newBalanceOrig=random.uniform(0, 50000),
        oldBalanceDest=random.uniform(0, 50000),
        newBalanceDest=random.uniform(0, 50000)
    ) for i in range(100)
]

mock_alerts = [
    Alert(
        id=f"alert_{i}",
        transactionId=f"txn_{random.randint(1, 100)}",
        date=(datetime.now() - timedelta(days=random.randint(0, 7))).isoformat(),
        severity=random.choice(["high", "medium", "low"]),
        status=random.choice(["pending", "investigating", "resolved", "false_positive"]),
        description=f"Alert for transaction {i}",
        assignedTo=random.choice([None, "analyst_1", "analyst_2"])
    ) for i in range(50)
]

mock_team = [
    TeamMember(
        id=f"member_{i}",
        name=f"Analyste {i}",
        email=f"analyste{i}@fraudshield.com",
        role=random.choice(["junior_analyst", "senior_analyst", "data_scientist", "admin", "compliance_officer"]),
        status="active",
        casesHandled=random.randint(10, 200)
    ) for i in range(10)
]

@app.post("/predict")
def predict_fraud(data: ClaimData):
    type_enc = le.transform([data.type_sinistre])[0]
    ratio    = data.nb_sinistres_12m / (data.age_compte_mois + 1)
    montant_eleve = int(data.montant_fcfa > 1000000)
    nouveau_client = int(data.age_compte_mois < 6)

    X = np.array([[
        data.age_compte_mois, data.nb_sinistres_12m, data.montant_fcfa,
        type_enc, data.nb_docs_fournis, data.delai_declaration_jours,
        data.sinistres_similaires, ratio, montant_eleve, nouveau_client
    ]])

    proba = model.predict_proba(X)[0][1]
    score = int(proba * 100)

    if score >= 70:
        niveau = "fraude_probable"
    elif score >= 40:
        niveau = "suspect"
    else:
        niveau = "normal"

    # Raisons (IA explicable)
    raisons = []
    if data.nb_sinistres_12m >= 4:
        raisons.append(f"{data.nb_sinistres_12m} sinistres en 12 mois (seuil : 4)")
    if data.montant_fcfa > 2000000 and data.age_compte_mois < 6:
        raisons.append(f"Montant {data.montant_fcfa:,} FCFA — compte jeune ({data.age_compte_mois} mois)")
    if data.sinistres_similaires >= 2:
        raisons.append(f"{data.sinistres_similaires} déclarations similaires détectées")
    if data.nb_docs_fournis <= 1 and data.montant_fcfa > 1000000:
        raisons.append(f"Documents insuffisants ({data.nb_docs_fournis}) pour montant élevé")
    if data.delai_declaration_jours > 60 and data.montant_fcfa > 800000:
        raisons.append(f"Déclaration tardive ({data.delai_declaration_jours} jours)")
    if not raisons:
        raisons.append("Aucune anomalie majeure détectée")

    return {
        "score": score,
        "niveau": niveau,
        "raisons": raisons[:3],
        "probabilite": round(float(proba), 4)
    }

@app.post("/predict-transaction")
def predict_transaction_fraud(data: PredictRequest):
    # Mock prediction for transaction data
    score = random.randint(0, 100)
    if score >= 70:
        risk_level = "high"
    elif score >= 40:
        risk_level = "medium"
    else:
        risk_level = "low"
    
    return {
        "prediction": 1 if score >= 50 else 0,
        "probability": score / 100,
        "risk_level": risk_level
    }

@app.get("/dashboard/stats")
def get_dashboard_stats():
    total = len(mock_transactions)
    fraudulent = len([t for t in mock_transactions if t.status == "fraud"])
    return DashboardStats(
        totalTransactions=total,
        fraudulentTransactions=fraudulent,
        fraudPercentage=round(fraudulent / total * 100, 2) if total > 0 else 0,
        pendingAlerts=len([a for a in mock_alerts if a.status == "pending"]),
        resolvedToday=len([a for a in mock_alerts if a.status == "resolved" and a.date.startswith(datetime.now().date().isoformat())]),
        avgResponseTime="2h 30m"
    )

@app.get("/transactions")
def get_transactions(limit: int = 50, offset: int = 0, status: Optional[str] = None, search: Optional[str] = None):
    filtered = mock_transactions
    if status:
        filtered = [t for t in filtered if t.status == status]
    if search:
        filtered = [t for t in filtered if search.lower() in t.id.lower() or search.lower() in t.clientId.lower()]
    return filtered[offset:offset + limit]

@app.get("/transactions/{transaction_id}")
def get_transaction_by_id(transaction_id: str):
    for t in mock_transactions:
        if t.id == transaction_id:
            return t
    raise HTTPException(status_code=404, detail="Transaction not found")

@app.get("/alerts")
def get_alerts(limit: int = 50, status: Optional[str] = None, severity: Optional[str] = None):
    filtered = mock_alerts
    if status:
        filtered = [a for a in filtered if a.status == status]
    if severity:
        filtered = [a for a in filtered if a.severity == severity]
    return filtered[:limit]

@app.get("/alerts/stats")
def get_alert_stats():
    return {
        "pending": len([a for a in mock_alerts if a.status == "pending"]),
        "investigating": len([a for a in mock_alerts if a.status == "investigating"]),
        "resolved": len([a for a in mock_alerts if a.status == "resolved"]),
        "false_positive": len([a for a in mock_alerts if a.status == "false_positive"])
    }

@app.patch("/alerts/{alert_id}")
def update_alert_status(alert_id: str, data: dict):
    for a in mock_alerts:
        if a.id == alert_id:
            a.status = data.get("status", a.status)
            a.assignedTo = data.get("assignedTo", a.assignedTo)
            return a
    raise HTTPException(status_code=404, detail="Alert not found")

@app.get("/analytics/daily")
def get_daily_stats(days: int = 7):
    stats = []
    for i in range(days):
        date = (datetime.now() - timedelta(days=i)).date().isoformat()
        total = random.randint(100, 500)
        fraudulent = random.randint(0, total // 10)
        stats.append(DailyStats(
            date=date,
            totalTransactions=total,
            fraudulentTransactions=fraudulent,
            fraudPercentage=round(fraudulent / total * 100, 2) if total > 0 else 0
        ))
    return stats

@app.get("/analytics/fraud-by-type")
def get_fraud_by_type():
    types = ["PAYMENT", "TRANSFER", "CASH_OUT", "DEBIT", "CASH_IN"]
    total_fraud = len([t for t in mock_transactions if t.status == "fraud"])
    return [
        FraudByType(
            type=t,
            count=len([tx for tx in mock_transactions if tx.type == t and tx.status == "fraud"]),
            percentage=round(len([tx for tx in mock_transactions if tx.type == t and tx.status == "fraud"]) / total_fraud * 100, 2) if total_fraud > 0 else 0
        ) for t in types
    ]

@app.get("/team")
def get_team_members():
    return mock_team

@app.patch("/team/{member_id}")
def update_team_member(member_id: str, data: dict):
    for m in mock_team:
        if m.id == member_id:
            for key, value in data.items():
                if hasattr(m, key):
                    setattr(m, key, value)
            return m
    raise HTTPException(status_code=404, detail="Member not found")

@app.post("/team")
def add_team_member(data: dict):
    new_member = TeamMember(
        id=f"member_{len(mock_team) + 1}",
        name=data["name"],
        email=data["email"],
        role=data["role"],
        status="active",
        casesHandled=0
    )
    mock_team.append(new_member)
    return new_member

@app.post("/auth/login")
def login(credentials: dict):
    # Mock login
    return {
        "token": "mock_jwt_token",
        "user": {
            "id": "user_1",
            "name": "Admin User",
            "email": credentials["email"],
            "role": "admin"
        }
    }

@app.post("/auth/logout")
def logout():
    return {"message": "Logged out"}

@app.get("/health")
def health():
    return {"status": "ok", "model": "RandomForest", "version": "1.0"}
