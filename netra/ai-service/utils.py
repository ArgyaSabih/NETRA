import pandas as pd
import numpy as np
import pickle
from io import StringIO
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException

with open('./model/gbc_model.pkl', 'rb') as f:
    gbc_model = pickle.load(f)

with open('./model/rf_model.pkl', 'rb') as f:
    rf_model = pickle.load(f)

def preprocess_data(df):
    for col in df.columns:
        if df[col].dtype == "float64":
            df[col] = df[col].fillna(0)
        else:
            df[col] = df[col].fillna("unknown")

    df["id.orig_p"] = df["id.orig_p"].astype(int)
    df["id.resp_p"] = df["id.resp_p"].astype(int)
    df["local_orig"] = df["local_orig"].astype(int)
    df["local_resp"] = df["local_resp"].astype(int)
    df = df[df["duration"] >= 0]
    df = df[df["orig_bytes"] >= 0]
    # df['label'] = df['label'].map({'Malicious': 1, 'Benign': 0}).astype('category')
    df["ts"] = pd.to_datetime(df["ts"], unit="s")

    df["bytes_total"] = df["orig_bytes"] + df["resp_bytes"]
    df["bytes_ratio"] = df["orig_bytes"] / (df["resp_bytes"] + 1)
    df["pkts_total"] = df["orig_pkts"] + df["resp_pkts"]
    df["bytes_per_pkt"] = df["bytes_total"] / (df["pkts_total"] + 1)
    df["flow_rate"] = df["bytes_total"] / (df["duration"] + 1e-6)
    df["pkt_ratio"] = df["orig_pkts"] / (df["resp_pkts"] + 1)
    freq = df["service"].value_counts()
    df["service_freq"] = df["service"].map(freq)
    df["unique_ports"] = df.groupby("id.orig_h")["id.resp_p"].transform("nunique")
    df["unique_dst"] = df.groupby("id.orig_h")["id.resp_h"].transform("nunique")

    df["conn_per_src"] = df.groupby("id.orig_h")["uid"].transform("count")
    df["unique_dst"] = df.groupby("id.orig_h")["id.resp_h"].transform("nunique")
    df["scan_ratio"] = df["unique_ports"] / (df["conn_per_src"] + 1)
    df["time_bin"] = df["ts"].dt.floor("10s")
    df["burst_10s"] = df.groupby(["id.orig_h","time_bin"])["uid"].transform("count")
    df["burst_ratio"] = df["burst_10s"] / (df["conn_per_src"] + 1)
    df["failed_conn"] = df["conn_state"].isin(["S0", "REJ"]).astype(int)
    df["fail_ratio"] = df.groupby("id.orig_h")["failed_conn"].transform("mean")
    df["dst_per_time"] = df["unique_dst"] / (df["burst_10s"] + 1)
    df["port_density"] = df["unique_ports"] / (df["conn_per_src"] + 1)
    df["dst_density"] = df["unique_dst"] / (df["conn_per_src"] + 1)

    for col in ["duration", "pkts_total", "orig_pkts"]:
        df[col] = np.log1p(df[col])

    drop_cols = [
        "id.resp_p",
        "id.orig_p",
        "orig_ip_bytes",
        "Unnamed: 0",
        "uid"
    ]

    df = df.drop(columns=drop_cols)
    # df = df.dropna(subset=['label'])

    # Select the top N most important features (e.g., top 5)
    sorted_importances = pd.read_csv('./model/important_features.csv', index_col=0)
    top_n_features = sorted_importances.head(8).index.to_list()
    
    # Ensure 'label' is also included for further analysis
    features_to_keep = top_n_features
    df_filtered = df[features_to_keep]

    return df_filtered

router = APIRouter()

@router.post("/predict")
async def predict_test(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    try:
        print("reading data")
        contents = await file.read()
        df_test = pd.read_csv(StringIO(contents.decode("utf-8")), index_col=0)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")

    try:
        print("preprocessing data")
        df_test_processed = preprocess_data(df_test)
        # ini harusnya dia gak ada label samsek karena kita try to detect something new
    except Exception as ve:
        raise HTTPException(status_code=400, detail=f"Failed to preprocess data: {ve}")

    try:
        print("predicting data")
        # try random forest
        y_pred_rf = rf_model.predict(df_test_processed)
        rf_df = pd.DataFrame(y_pred_rf)

        # try gradient boost
        y_pred_gbc = gbc_model.predict(df_test_processed)
        gbc_df = pd.DataFrame(y_pred_gbc)
    except Exception as pe:
        raise HTTPException(status_code=400, detail=f"Failed to predict data: {pe}")

    return {"message": "Prediction ran sucessfully", "output": gbc_df.to_json(), "output_rf": rf_df.to_json()}

# Placeholder
print("AI service-NETRA is running")