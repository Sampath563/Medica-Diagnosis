import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# Create Flask app
app = Flask(__name__)
CORS(app)

# Global variables
vectorizer = None
scaler = None
models = {}

def load_models():
    global vectorizer, scaler, models
    try:
        # FIXED PATHS with 'backend/' prefix
        vectorizer = joblib.load("backend/models/symptom_vectorizer.pkl")
        print(f"✅ Vectorizer vocabulary size: {len(vectorizer.vocabulary_)}")

        scaler = joblib.load("backend/models/medical_scaler.pkl")

        logistic_model = joblib.load("backend/models/best_medical_model_logistic_regression.pkl")
        models['logistic'] = logistic_model

        # Load ensemble model if available
        try:
            ensemble_model = joblib.load("backend/models/ensemble_medical_model.pkl")
            models['ensemble'] = ensemble_model
            print("✅ Ensemble model loaded")
        except FileNotFoundError:
            print("ℹ️ Ensemble model not found, skipping...")

        return True

    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return False
    
def preprocess_input(data):
    try:
        # Debug: print vectorizer type and attributes
        print(f"Vectorizer type: {type(vectorizer)}")
        if hasattr(vectorizer, 'idf_'):
            print(f"Vectorizer idf_ shape: {vectorizer.idf_.shape}")
        else:
            print("Vectorizer does not have idf_ attribute")

        # Extract and convert input fields
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
        combined = np.hstack([symptom_vec.toarray(), vital_vec])
        return combined

    except Exception as e:
        print(f"❌ Error in preprocess_input: {e}")
        return None
            
# Load models once at startup
load_models()

# ✅ Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        features = preprocess_input(data)

        if features is None:
            return jsonify({"error": "Invalid input data"}), 400

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

if __name__ == "__main__":
    app.run(debug=True)
