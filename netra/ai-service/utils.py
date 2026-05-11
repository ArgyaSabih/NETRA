import pandas as pd
import numpy as np
import pickle
from io import StringIO
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

with open('./model/gbc_model.pkl', 'rb') as f:
    gbc_model = pickle.load(f)

with open('./model/rf_model.pkl', 'rb') as f:
    rf_model = pickle.load(f)

# Pydantic models for JSON requests
class PredictionRequest(BaseModel):
    data: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    version: str = "1.0.0"

def get_important_features():
    """Load important features from CSV"""
    try:
        sorted_importances = pd.read_csv('./model/important_features.csv', index_col=0)
        return sorted_importances.head(8).index.to_list()
    except:
        # Fallback to manual feature list if file doesn't exist
        return ['scan_ratio', 'dst_density', 'port_density', 'conn_per_src', 
                'dst_per_time', 'pkt_ratio', 'burst_10s', 'unique_ports']

def preprocess_data_simple(df):
    """Simplified preprocessing for JSON data input"""
    # Get important features
    important_features = get_important_features()
    
    # Select only important features if they exist in the dataframe
    available_features = [f for f in important_features if f in df.columns]
    
    if len(available_features) == 0:
        # If no important features, use all columns except 'label' if it exists
        if 'label' in df.columns:
            available_features = [col for col in df.columns if col != 'label']
        else:
            available_features = df.columns.tolist()
    
    df_filtered = df[available_features].copy()
    
    # Fill NaN values
    df_filtered = df_filtered.fillna(0)
    
    return df_filtered

def preprocess_data(df):
    """Full preprocessing for CSV file input"""
    for col in df.columns:
        if df[col].dtype == "float64":
            df[col] = df[col].fillna(0)
        else:
            df[col] = df[col].fillna("unknown")

    # Handle specific columns if they exist
    for col in ["id.orig_p", "id.resp_p", "local_orig", "local_resp"]:
        if col in df.columns:
            df[col] = df[col].astype(int)
    
    if "duration" in df.columns:
        df = df[df["duration"] >= 0]
    if "orig_bytes" in df.columns:
        df = df[df["orig_bytes"] >= 0]
    if "ts" in df.columns:
        df["ts"] = pd.to_datetime(df["ts"], unit="s")

    # Create features if base columns exist
    if "orig_bytes" in df.columns and "resp_bytes" in df.columns:
        df["bytes_total"] = df["orig_bytes"] + df["resp_bytes"]
        df["bytes_ratio"] = df["orig_bytes"] / (df["resp_bytes"] + 1)
    
    if "orig_pkts" in df.columns and "resp_pkts" in df.columns:
        df["pkts_total"] = df["orig_pkts"] + df["resp_pkts"]
        df["pkt_ratio"] = df["orig_pkts"] / (df["resp_pkts"] + 1)
    
    if "bytes_total" in df.columns and "pkts_total" in df.columns:
        df["bytes_per_pkt"] = df["bytes_total"] / (df["pkts_total"] + 1)
    
    if "bytes_total" in df.columns and "duration" in df.columns:
        df["flow_rate"] = df["bytes_total"] / (df["duration"] + 1e-6)

    if "unique_ports" in df.columns and "conn_per_src" in df.columns:
        df["scan_ratio"] = df["unique_ports"] / (df["conn_per_src"] + 1)
        df["port_density"] = df["unique_ports"] / (df["conn_per_src"] + 1)
    
    if "unique_dst" in df.columns and "conn_per_src" in df.columns:
        df["dst_density"] = df["unique_dst"] / (df["conn_per_src"] + 1)
    
    if "unique_dst" in df.columns and "burst_10s" in df.columns:
        df["dst_per_time"] = df["unique_dst"] / (df["burst_10s"] + 1)

    # Log transform if columns exist
    for col in ["duration", "pkts_total", "orig_pkts"]:
        if col in df.columns:
            df[col] = np.log1p(df[col])

    # Drop columns
    drop_cols = ["id.resp_p", "id.orig_p", "orig_ip_bytes", "Unnamed: 0", "uid"]
    df = df.drop(columns=[col for col in drop_cols if col in df.columns], errors='ignore')

    # Select important features
    important_features = get_important_features()
    available_features = [f for f in important_features if f in df.columns]
    
    if len(available_features) > 0:
        df_filtered = df[available_features]
    else:
        df_filtered = df

    return df_filtered

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "AI Prediction Service", "version": "1.0.0"}

@router.post("/predict-json")
async def predict_json(request: PredictionRequest):
    """Predict from JSON data (from Next.js upload)"""
    try:
        # Convert data to DataFrame
        df_test = pd.DataFrame(request.data)
        
        print(f"[AI Service] Received {len(df_test)} records for prediction")
        
        # Preprocess data
        print("[AI Service] Preprocessing data...")
        df_test_processed = preprocess_data_simple(df_test)
        
        print(f"[AI Service] Features used: {df_test_processed.columns.tolist()}")
        
        # Make predictions
        print("[AI Service] Making predictions...")
        y_pred_rf = rf_model.predict(df_test_processed)
        y_pred_gbc = gbc_model.predict(df_test_processed)
        
        # Calculate confidence scores
        y_pred_proba_rf = rf_model.predict_proba(df_test_processed)
        y_pred_proba_gbc = gbc_model.predict_proba(df_test_processed)
        
        # Average the probabilities
        avg_proba = (y_pred_proba_rf + y_pred_proba_gbc) / 2
        confidence_scores = np.max(avg_proba, axis=1).tolist()
        
        # Combine predictions (use RF as primary)
        predictions = y_pred_rf.tolist()
        
        malicious_count = int(np.sum(y_pred_rf))
        print(f"[AI Service] Predictions complete: {malicious_count} malicious, {len(y_pred_rf) - malicious_count} benign")
        
        return {
            "success": True,
            "predictions": predictions,
            "confidence_scores": confidence_scores,
            "malicious_count": malicious_count,
            "benign_count": int(len(y_pred_rf) - np.sum(y_pred_rf)),
            "total_records": len(y_pred_rf),
            "model_used": "random_forest"
        }
    
    except Exception as e:
        print(f"[AI Service] Prediction error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@router.post("/predict")
async def predict_csv(file: UploadFile = File(...)):
    """Predict from CSV file upload"""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    try:
        print(f"[AI Service] Reading file: {file.filename}")
        contents = await file.read()
        df_test = pd.read_csv(StringIO(contents.decode("utf-8")), index_col=0)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")

    try:
        print("[AI Service] Preprocessing data...")
        df_test_processed = preprocess_data(df_test)
    except Exception as ve:
        raise HTTPException(status_code=400, detail=f"Failed to preprocess data: {ve}")

    try:
        print("[AI Service] Making predictions...")
        y_pred_rf = rf_model.predict(df_test_processed)
        y_pred_gbc = gbc_model.predict(df_test_processed)
        
        rf_df = pd.DataFrame(y_pred_rf)
        gbc_df = pd.DataFrame(y_pred_gbc)
        
    except Exception as pe:
        raise HTTPException(status_code=400, detail=f"Failed to predict data: {pe}")

    return {
        "message": "Prediction ran successfully",
        "output": gbc_df.to_json(),
        "output_rf": rf_df.to_json(),
        "total_records": len(y_pred_rf),
        "malicious_count": int(np.sum(y_pred_rf))
    }

print("[AI Service] Utils module loaded - AI service NETRA is ready")