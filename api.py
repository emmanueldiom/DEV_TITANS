
import joblib
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

@app.get("/health")
def health():
    return {"status": "ok", "model": "RandomForest", "version": "1.0"}
