import pandas as pd
import numpy as np
import pickle
from io import StringIO
import tempfile, os
from sklearn.preprocessing import StandardScaler
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

with open('./model/gbc_model.pkl', 'rb') as f:
    gbc_model = pickle.load(f)

with open('./model/rf_model.pkl', 'rb') as f:
    rf_model = pickle.load(f)

with open('./model/isolation.pkl', 'rb') as f:
    iso_model = pickle.load(f)

# Pydantic models for JSON requests
class PredictionRequest(BaseModel):
    data: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    version: str = "1.0.0"
    
def parse_zeek_log(filepath):
    fields = None
    types = None

    with open(filepath) as f:
        for line in f:
            if line.startswith("#fields"):
                fields = line.strip().split("\t")[1:]
            elif line.startswith("#types"):
                types = line.strip().split("\t")[1:]
            elif not line.startswith("#"):
                break

    df = pd.read_csv(
        filepath,
        sep="\t",
        comment="#",
        names=fields,
        engine="python",
        na_values=["-", "(empty)"]
    )

    if "tunnel_parents   label   detailed-label" in df.columns:
     last = df["tunnel_parents   label   detailed-label"].astype(str)

     if last.str.contains("Benign|Malicious").any():
        split_cols = last.str.rsplit("   ", n=2, expand=True)

        df["tunnel_parents"] = split_cols[0]
        df["label"] = split_cols[1]
        df["detailed-label"] = split_cols[2]
    df.drop(columns=["tunnel_parents   label   detailed-label"], inplace=True)

    return df

def preprocess_data_new(df):
    X = df.select_dtypes(include=['number'])

    drop_cols = [
    'uid',
    'id.orig_h',
    'id.resp_h',
    'ts'
    ]

    X = X.drop(columns=drop_cols, errors='ignore')
    X = X.fillna(0)

    for col in X.columns:
        if X[col].dtype in ['float64', 'int64']:
            X[col] = X[col].fillna(X[col].median())
        else:
            X[col] = X[col].fillna('unknown')

    scaler = StandardScaler()

    X_scaled = scaler.fit_transform(X)

    return X_scaled

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "AI Prediction Service", "version": "1.0.0"}

@router.post("/predict-new")
async def predict(file: UploadFile = File(...)):
    try:
        print(f"[AI Service] Reading file: {file.filename}")
        if (file.filename.endswith(".log") or file.filename.endswith(".test")):
            print(f"[AI Service] Preprocessing file as CSV: {file.filename} from Zeek log")
            contents = await file.read()
            with tempfile.NamedTemporaryFile(delete=False, suffix=".log") as tmp:
                tmp.write(contents)
                tmp_path = tmp.name
            try:
                df_test = parse_zeek_log(tmp_path)
            finally:
                os.unlink(tmp_path)
        else:
            contents = await file.read()
            df_test = pd.read_csv(StringIO(contents.decode("utf-8")), index_col=0)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")

    try:
        print("[AI Service] Preprocessing data...")
        df_test_processed = preprocess_data_new(df_test)
    except Exception as ve:
        raise HTTPException(status_code=400, detail=f"Failed to preprocess data: {ve}")

    try:
        print("[AI Service] Making predictions...")
        y_pred = iso_model.predict(df_test_processed)
        confidence_scores = iso_model.decision_function(df_test_processed)
        human_readable = np.where(
            y_pred == -1,
            'potentially malicious',
            'benign-like'
        )

        # turn to series
        interpretation = pd.Series(human_readable)
        scores = pd.Series(confidence_scores)
        counts = interpretation.value_counts()
        pred = pd.Series(y_pred)
        total_records = len(pred)

        # counts
        benign_count = counts.get('benign-like', 0)
        malicious_count = counts.get('potentially malicious', 0)
        
        # final dataframe
        df_result = pd.DataFrame(df_test[['ts', 'id.orig_h', 'id.resp_h', 'proto']])
        df_result['prediction'] = pred
        df_result['prediction'] = df_result['prediction'].map({-1: 'potentially malicious', 1: 'benign-like'})
        
    except Exception as pe:
        raise HTTPException(status_code=400, detail=f"Failed to predict data: {pe}")

    return {
        "message": "Prediction ran successfully",
        "output": pred.tolist(),
        "total_records": int(total_records),
        "malicious_count": int(malicious_count),
        "benign_count": int(benign_count),
        "anomaly_scores": scores.tolist(),
        "model_used": "isolation_forest",
        "table": df_result.sample(10).to_json(),
        "full_table": df_result.to_json()
    }

print("[AI Service] Utils module loaded - AI service NETRA is ready")