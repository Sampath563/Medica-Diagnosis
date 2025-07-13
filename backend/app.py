import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from serpapi_util import fetch_search_results
from dotenv import load_dotenv
from pathlib import Path

# Load .env file explicitly
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

print(f"DEBUG: Loaded .env file from: {env_path.resolve()}")
serpapi_key = os.getenv('SERPAPI_KEY')
if serpapi_key:
    print(f"DEBUG: Loaded SERPAPI_KEY: {serpapi_key[:4]}****")
else:
    print("DEBUG: SERPAPI_KEY is not set or could not be loaded.")
    
# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Global model variables
vectorizer = None
scaler = None
models = {}

def load_models():
    global vectorizer, scaler, models
    try:
        base_path = os.path.dirname(os.path.abspath(__file__))
        vectorizer = joblib.load(os.path.join(base_path, "models", "symptom_vectorizer.pkl"))
        scaler = joblib.load(os.path.join(base_path, "models", "medical_scaler.pkl"))
        models['logistic'] = joblib.load(os.path.join(base_path, "models", "best_medical_model_logistic_regression.pkl"))

        try:
            models['ensemble'] = joblib.load(os.path.join(base_path, "models", "ensemble_medical_model.pkl"))
            print("✅ Ensemble model loaded")
        except FileNotFoundError:
            print("ℹ️ Ensemble model not found, skipping...")

        print(f"✅ Vectorizer loaded with vocab size: {len(vectorizer.vocabulary_)}")
        return True
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return False

def preprocess_input(data):
    try:
        symptom_text = data.get("symptoms", "")
        bp = data.get("blood_pressure", "0/0")

        try:
            sys, dia = map(int, bp.split("/"))
            bp_avg = (sys + dia) / 2
        except:
            bp_avg = 0

        vitals = [
            bp_avg,
            float(data.get("heart_rate", 0)),
            float(data.get("age", 0)),
            float(data.get("temperature", 0)),
            float(data.get("oxygen_saturation", 0))
        ]

        symptom_vec = vectorizer.transform([symptom_text])
        vital_vec = scaler.transform([vitals])
        return np.hstack([symptom_vec.toarray(), vital_vec])
    except Exception as e:
        print(f"❌ Preprocessing error: {e}")
        return None

# Load models
load_models()

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        features = preprocess_input(data)

        if features is None:
            return jsonify({"error": "Invalid input"}), 400

        predictions = {}

        if 'logistic' in models:
            pred = models['logistic'].predict(features)[0]
            prob = np.max(models['logistic'].predict_proba(features))
            predictions['logistic'] = {"prediction": pred, "confidence": float(prob)}

        if 'ensemble' in models:
            pred = models['ensemble'].predict(features)[0]
            prob = np.max(models['ensemble'].predict_proba(features))
            predictions['ensemble'] = {"prediction": pred, "confidence": float(prob)}

        return jsonify({"result": predictions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/treatment", methods=["POST"])
def generate_treatment():
    try:
        data = request.get_json()
        query = (
            f"{data['disease']} treatment for a {data['age']}-year-old patient "
            f"with symptoms {data['symptoms']}, blood group {data['bloodGroup']}, duration {data['duration']}"
        )
        results = fetch_search_results(query)
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)