import React, { useState } from 'react';
import { Activity, Heart, Thermometer, Droplets, User, Calendar, AlertCircle, CheckCircle, Loader2, Plus } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';

// Updated interfaces to support top_predictions
interface SinglePrediction {
  disease: string;
  confidence: number;
}

interface ModelPrediction {
  disease: string;
  confidence: number;
  top_predictions?: SinglePrediction[];
}

interface PredictionResult {
  predicted_disease: string;
  confidence: number;
  all_predictions: {
    [key: string]: ModelPrediction;
  };
}

// Interface for backend response structure
interface BackendPrediction {
  prediction: string;
  confidence: number;
  top_predictions?: SinglePrediction[];
}

interface BackendResponse {
  result: {
    [key: string]: BackendPrediction;
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

  // New state for inline vital signs errors
  const [tempError, setTempError] = useState<string | null>(null);
  const [heartRateError, setHeartRateError] = useState<string | null>(null);
  const [bpError, setBpError] = useState<string | null>(null);
  const [oxygenSatError, setOxygenSatError] = useState<string | null>(null);
  // New state for symptoms error
  const [symptomsError, setSymptomsError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Clear symptoms error when user starts typing
    if (name === 'symptoms') {
      setSymptomsError(null);
    }

    // Validate vital signs on input change
    if (name === 'temperature') {
      const temp = parseFloat(value);
      if (value === '') {
        setTempError(null);
      } else if (isNaN(temp) || temp < 95 || temp > 107) {
        setTempError('Temperature must be between 95°F and 107°F');
      } else {
        setTempError(null);
      }
    } else if (name === 'heart_rate') {
      const heartRate = parseInt(value, 10);
      if (value === '') {
        setHeartRateError(null);
      } else if (isNaN(heartRate) || heartRate < 30 || heartRate > 220) {
        setHeartRateError('Heart rate must be between 30 and 220 bpm');
      } else {
        setHeartRateError(null);
      }
    } else if (name === 'blood_pressure') {
      if (value === '') {
        setBpError(null);
      } else {
        const bpMatch = value.match(/^(\d{2,3})\/(\d{2,3})$/);
        if (!bpMatch) {
          setBpError('Blood pressure must be in format "Systolic/Diastolic" (e.g., 120/80)');
        } else {
          const systolic = parseInt(bpMatch[1], 10);
          const diastolic = parseInt(bpMatch[2], 10);
          if (systolic < 70 || systolic > 250 || diastolic < 40 || diastolic > 140) {
            setBpError('Blood pressure values are out of valid range');
          } else {
            setBpError(null);
          }
        }
      }
    } else if (name === 'oxygen_saturation') {
      const oxygenSat = parseInt(value, 10);
      if (value === '') {
        setOxygenSatError(null);
      } else if (isNaN(oxygenSat) || oxygenSat < 80 || oxygenSat > 100) {
        setOxygenSatError('Oxygen saturation must be between 80% and 100%');
      } else {
        setOxygenSatError(null);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Check required fields
    if (!formData.symptoms || !formData.age || !formData.gender || !formData.severity || 
        !formData.temperature || !formData.heart_rate || !formData.blood_pressure || 
        !formData.oxygen_saturation) {
      setError('Please fill in all required fields');
      return;
    }

    // Also check if any inline vital sign errors exist before submission
    if (tempError || heartRateError || bpError || oxygenSatError) {
      setError('Please fix the errors in vital signs before submitting');
      return;
    }

    // Validate symptoms
    const allowedSymptoms = [
      "abdominal pain", "back pain", "balance problems", "bloating", "blurred vision", "body pain",
      "bone fractures", "bone pain", "burning sensation", "chest pain", "chest tightness", "chills",
      "cold", "concentration problems", "confusion", "congestion", "constipation", "cough",
      "diarrhea", "difficulty concentrating", "difficulty swallowing", "difficulty walking", "dizziness",
      "dry mouth", "easy bruising", "excessive sweating", "facial pain", "fatigue", "fever",
      "frequent infections", "frequent urination", "hair loss", "headache", "heartburn", "irritability",
      "itching", "jaundice", "joint pain", "loss of appetite", "loss of height", "loss of taste",
      "memory loss", "mood changes", "mucus production", "muscle weakness", "nausea", "neck pain",
      "neck stiffness", "night sweats", "pale skin", "palpitations", "rapid breathing", "rapid heartbeat",
      "rash", "rectal bleeding", "redness", "seizures", "sensitivity to light", "shortness of breath",
      "skin rash", "sleep problems", "snoring", "sore throat", "stiffness", "sweating", "swelling",
      "swollen glands", "swollen lymph nodes", "thirst", "tremor", "vomiting", "weakness", "weight gain",
      "weight loss", "wheezing"
    ];

    const inputSymptoms = formData.symptoms
      .toLowerCase()
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const invalidSymptoms = inputSymptoms.filter(symptom => !allowedSymptoms.includes(symptom));

    if (invalidSymptoms.length > 0) {
      setSymptomsError(`Invalid symptom(s): ${invalidSymptoms.join(', ')}`);
      return;
    }

    // Proceed to backend submission
    setLoading(true);
    setError(null);
    setSymptomsError(null);
    setPrediction(null);

    try {
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

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

      const result: BackendResponse = await response.json();
      const backendPredictions = result.result || {};
      const firstModelKey = Object.keys(backendPredictions)[0] || '';
      
      const transformedPrediction: PredictionResult = {
        predicted_disease: firstModelKey ? backendPredictions[firstModelKey].prediction : '',
        confidence: firstModelKey ? backendPredictions[firstModelKey].confidence : 0,
        all_predictions: {}
      };

      // Transform backend predictions to match our interface
      for (const [model, pred] of Object.entries(backendPredictions)) {
        transformedPrediction.all_predictions[model] = {
          disease: pred.prediction,
          confidence: pred.confidence,
          // Safely handle top_predictions - this should now work without TypeScript errors
          top_predictions: pred.top_predictions || undefined
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
    setSymptomsError(null);
  };

  const navigateToTreatment = () => {
    if (!prediction) return;

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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      symptomsError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={3}
                    required
                  />
                  {symptomsError && (
                    <p className="text-red-500 text-sm mt-1">{symptomsError}</p>
                  )}
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          tempError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="98.6"
                        required
                      />
                      {tempError && <p className="text-red-500 text-sm mt-1">{tempError}</p>}
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          heartRateError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="72"
                        required
                      />
                      {heartRateError && <p className="text-red-500 text-sm mt-1">{heartRateError}</p>}
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          bpError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="120/80"
                        required
                      />
                      {bpError && <p className="text-red-500 text-sm mt-1">{bpError}</p>}
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          oxygenSatError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="98"
                        min="80"
                        max="100"
                        required
                      />
                      {oxygenSatError && <p className="text-red-500 text-sm mt-1">{oxygenSatError}</p>}
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
                      <div className="space-y-3">
                        {Object.entries(prediction.all_predictions).map(([model, pred]) => (
                          <div key={model} className="bg-white p-3 rounded shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600 capitalize">{model} Model:</span>
                              <div className="text-right">
                                <div className="text-sm font-medium">{pred.disease}</div>
                                <div className="text-xs text-gray-500">{(pred.confidence * 100).toFixed(1)}%</div>
                              </div>
                            </div>
                            {/* Fixed top_predictions rendering with proper type safety */}
                            {pred.top_predictions && pred.top_predictions.length > 0 && (
                              <div className="mt-2">
                                <h5 className="text-xs font-medium text-gray-600 mb-1">Top Predictions:</h5>
                                <ul className="list-disc list-inside text-xs text-gray-700 pl-2 space-y-1">
                                  {pred.top_predictions.map((item, index) => (
                                    <li key={index}>
                                      {item.disease} – {(item.confidence * 100).toFixed(1)}%
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
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