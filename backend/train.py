# ✅ logistic_only_train.py — Retrain Logistic + Ensemble (on full features)
import os
import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Make sure the models folder exists
os.makedirs("models", exist_ok=True)

# Load dataset
df = pd.read_csv("backend/enhanced_medical_dataset_100k.csv")

# (rest of your code)


# Clean BP field (e.g., '120/80') → average

def convert_bp(bp_str):
    try:
        systolic, diastolic = map(int, bp_str.split('/'))
        return (systolic + diastolic) / 2
    except:
        return np.nan

df["Blood Pressure"] = df["Blood Pressure"].apply(convert_bp)

# Drop rows with missing data
df.dropna(subset=[
    "Symptoms", "Blood Pressure", "Heart Rate (bpm)",
    "Age", "Temperature (°F)", "Oxygen Saturation (%)", "Disease"
], inplace=True)

# Vectorize symptom text
symptom_texts = df["Symptoms"].astype(str)
vectorizer = TfidfVectorizer()
X_symptoms = vectorizer.fit_transform(symptom_texts)

# Scale vitals
vitals = df[["Blood Pressure", "Heart Rate (bpm)", "Age", "Temperature (°F)", "Oxygen Saturation (%)"]]
scaler = StandardScaler()
X_vitals = scaler.fit_transform(vitals)

# Combine symptom + vital features
X = np.hstack([X_symptoms.toarray(), X_vitals])
y = df["Disease"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train logistic regression
log_model = LogisticRegression(max_iter=1000)
log_model.fit(X_train, y_train)

# Train ensemble model (on full combined features!)
ensemble_model = RandomForestClassifier(n_estimators=100, random_state=42)
ensemble_model.fit(X_train, y_train)

# Save models
joblib.dump(log_model, "models/best_medical_model_logistic_regression.pkl")
joblib.dump(ensemble_model, "models/ensemble_medical_model.pkl")
joblib.dump(vectorizer, "models/symptom_vectorizer.pkl")
joblib.dump(scaler, "models/medical_scaler.pkl")

print("\n✅ All models trained on full features (101 total) and saved!")
print(f"✅ Vectorizer vocabulary size: {len(vectorizer.get_feature_names_out())}")
