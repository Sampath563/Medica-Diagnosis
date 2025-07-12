import sys
import numpy as np
import app

def main():
    # Load models and preprocessors
    if not app.load_models():
        print("Failed to load models.")
        sys.exit(1)

    # Sample input data
    sample_data = {
        'symptoms': 'fever cough headache',
        'age': 45,
        'gender': 'male',
        'severity': 'moderate',
        'temperature': 38.5,
        'heart_rate': 85,
        'blood_pressure': '120/80',
        'oxygen_saturation': 95
    }

    # Preprocess the input using the app's function
    features = app.preprocess_input(sample_data)
    if features is None:
        print("Error preprocessing input data.")
        sys.exit(1)

    # Debug: print shapes
    symptom_vector = app.vectorizer.transform([sample_data['symptoms']])
    print(f"Vectorizer vocabulary size: {len(app.vectorizer.get_feature_names_out())}")
    print(f"Symptom vector shape (test script): {symptom_vector.shape}")
    print(f"Features shape (combined): {features.shape}")

    # Print expected input feature count for each model
    if 'logistic' in app.models:
        print(f"Logistic model expected input features: {app.models['logistic'].coef_.shape[1]}")
    if 'ensemble' in app.models:
        if hasattr(app.models['ensemble'], 'estimators_') and len(app.models['ensemble'].estimators_) > 0:
            est = app.models['ensemble'].estimators_[0]
            if hasattr(est, 'coef_'):
                print(f"Ensemble model first estimator expected input features: {est.coef_.shape[1]}")
            else:
                print("Ensemble model first estimator does not have coef_ attribute")
        else:
            print("Ensemble model does not have estimators_ or is empty")

    # Make predictions
    predictions = {}

    if 'logistic' in app.models:
        logistic_pred = app.models['logistic'].predict(features)[0]
        logistic_proba = app.models['logistic'].predict_proba(features)[0]
        predictions['logistic'] = {
            'disease': logistic_pred,
            'confidence': float(np.max(logistic_proba))
        }

    if 'ensemble' in app.models:
        ensemble_pred = app.models['ensemble'].predict(features)[0]
        ensemble_proba = app.models['ensemble'].predict_proba(features)[0]
        predictions['ensemble'] = {
            'disease': ensemble_pred,
            'confidence': float(np.max(ensemble_proba))
        }

    # Pick main result
    primary_prediction = predictions.get('ensemble', predictions.get('logistic'))

    # Print results
    print("\n🔍 Prediction Results:")
    print(f"Predicted Disease: {primary_prediction['disease']}")
    print(f"Confidence: {primary_prediction['confidence']:.4f}")
    print("All Model Predictions:")
    for model_name, result in predictions.items():
        print(f"  {model_name.title()} → Disease: {result['disease']} | Confidence: {result['confidence']:.4f}")

if __name__ == '__main__':
    main()
