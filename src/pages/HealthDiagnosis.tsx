import React, { useState } from 'react';
import { Activity, Heart, Thermometer, Droplets, User, Calendar, AlertCircle, CheckCircle, Loader2, Plus } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';

interface PredictionResult {
  predicted_disease: string;
  confidence: number;
  all_predictions: {
    [key: string]: {
      disease: string;
      confidence: number;
    };
  };
}

interface FormData {
  symptoms: string;
  age: string;
  gender: string;
  severity: string;
  temperature: string;
  heart_rate: string;
  blood_pressure: string;
  oxygen_saturation: string;
}

const HealthDiagnosis: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    symptoms: '',
    age: '',
    gender: '',
    severity: '',
    temperature: '',
    heart_rate: '',
    blood_pressure: '',
    oxygen_saturation: ''
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.symptoms || !formData.age || !formData.gender || !formData.severity || 
        !formData.temperature || !formData.heart_rate || !formData.blood_pressure || 
        !formData.oxygen_saturation) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Define backend API base URL - try port 8000 primarily, fallback to 5000 if needed
      const backendBaseUrl = 'http://localhost:8000';

      const response = await fetch(`${backendBaseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }

      const result = await response.json();
      const backendPredictions = result.result || {};
      const firstModelKey = Object.keys(backendPredictions)[0] || '';
      const transformedPrediction = {
        predicted_disease: firstModelKey ? backendPredictions[firstModelKey].prediction : '',
        confidence: firstModelKey ? backendPredictions[firstModelKey].confidence : 0,
        all_predictions: {} as { [key: string]: { disease: string; confidence: number } }
      };
      for (const [model, pred] of Object.entries(backendPredictions)) {
        const p = pred as { prediction: string; confidence: number };
        transformedPrediction.all_predictions[model] = {
          disease: p.prediction,
          confidence: p.confidence
        };
      }
      setPrediction(transformedPrediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      symptoms: '',
      age: '',
      gender: '',
      severity: '',
      temperature: '',
      heart_rate: '',
      blood_pressure: '',
      oxygen_saturation: ''
    });
    setPrediction(null);
    setError(null);
  };

  const navigateToTreatment = () => {
  if (!prediction) return;                   // no prediction, nothing to send

  navigate('/treatment-planner', {
    state: {
      disease: prediction.predicted_disease,
      age: formData.age,
      symptoms: formData.symptoms,
    },
  });
};

  return (
    <>
      <NavigationBar />
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mt-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Medical Diagnosis AI</h1>
            <p className="text-lg text-gray-600">Advanced ML-powered health diagnosis system</p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600" />
                Patient Information
              </h2>

              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Describe symptoms (e.g., headache, fever, nausea, dizziness)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptom Severity
                  </label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Severity</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                {/* Vital Signs */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Vital Signs
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Thermometer className="w-4 h-4 mr-1" />
                        Temperature (°F)
                      </label>
                      <input
                        type="number"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleInputChange}
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="98.6"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        name="heart_rate"
                        value={formData.heart_rate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="72"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Pressure
                      </label>
                      <input
                        type="text"
                        name="blood_pressure"
                        value={formData.blood_pressure}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="120/80"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Droplets className="w-4 h-4 mr-1" />
                        Oxygen Saturation (%)
                      </label>
                      <input
                        type="number"
                        name="oxygen_saturation"
                        value={formData.oxygen_saturation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="98"
                        min="80"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5 mr-2" />
                        Get Diagnosis
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Results */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-green-600" />
                Diagnosis Results
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {prediction && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
  <div className="flex items-center mb-2">
    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
    <span className="text-green-700 font-medium">Primary Diagnosis</span>
  </div>
  <div className="text-2xl font-bold text-green-800 mb-2 text-center">
    {prediction.predicted_disease}
  </div>
  <div className="text-sm text-green-600 text-center mb-4">
    Confidence: {(prediction.confidence * 100).toFixed(1)}%
  </div>
  <div className="text-center">
    <button
      onClick={navigateToTreatment}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md shadow"
    >
      Generate Treatment Plan for {prediction.predicted_disease}
    </button>
  </div>
</div>

                  {prediction.all_predictions && Object.keys(prediction.all_predictions).length > 1 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <h4 className="font-medium text-blue-800 mb-3">All Model Predictions:</h4>
                      <div className="space-y-2">
                        {Object.entries(prediction.all_predictions).map(([model, pred]) => (
                          <div key={model} className="flex justify-between items-center bg-white p-2 rounded">
                            <span className="text-sm text-gray-600 capitalize">{model} Model:</span>
                            <div className="text-right">
                              <div className="text-sm font-medium">{pred.disease}</div>
                              <div className="text-xs text-gray-500">{(pred.confidence * 100).toFixed(1)}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="text-yellow-700 font-medium">Medical Disclaimer</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      This AI diagnosis is for informational purposes only and should not replace professional medical advice. 
                      Please consult with a healthcare provider for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              )}

              {!prediction && !error && !loading && (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Enter patient information and click "Get Diagnosis" to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthDiagnosis;
