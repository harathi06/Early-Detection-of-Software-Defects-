import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  RotateCcw, 
  Layers, 
  AlertTriangle,
  Lightbulb,
  Check,
  TrendingUp,
  Percent
} from 'lucide-react';
import { DATASETS_INFO } from '../data/datasetPresets';
import { predictDefectApi } from '../api/client';

export default function DefectPrediction({ activeDataset, setActiveDataset }) {
  const currentDatasetInfo = DATASETS_INFO[activeDataset] || DATASETS_INFO.jm1;

  // Initialize features with default values
  const [features, setFeatures] = useState(() => {
    const init = {};
    currentDatasetInfo.features.forEach(f => {
      init[f.name] = f.default !== undefined ? f.default : 10.0;
    });
    return init;
  });

  const [selectedClassifier, setSelectedClassifier] = useState('RandomForest');
  const [selectedNormalization, setSelectedNormalization] = useState('Standard');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFeatures(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const loadPreset = (type) => {
    if (type === 'defective') {
      setFeatures({ ...currentDatasetInfo.sampleDefective });
    } else if (type === 'clean') {
      setFeatures({ ...currentDatasetInfo.sampleClean });
    } else {
      const reset = {};
      currentDatasetInfo.features.forEach(f => {
        reset[f.name] = f.default !== undefined ? f.default : 10.0;
      });
      setFeatures(reset);
    }
    setPrediction(null);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictDefectApi(activeDataset, selectedClassifier, selectedNormalization, features);
      setPrediction(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header & Preset Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-indigo-400" />
              Software Module Defect Predictor
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter module software metrics to predict defective vs. clean status with confidence scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadPreset('defective')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              Load Defective Sample
            </button>
            <button
              onClick={() => loadPreset('clean')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Load Clean Sample
            </button>
            <button
              onClick={() => loadPreset('reset')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              title="Reset metrics"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Features Input Form */}
        <form onSubmit={handlePredict} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Target Model:</span>
              <select
                value={selectedClassifier}
                onChange={(e) => setSelectedClassifier(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-indigo-400 font-semibold focus:outline-hidden"
              >
                <option value="RandomForest">Random Forest (Ensemble)</option>
                <option value="DecisionTree">Decision Tree</option>
                <option value="LogisticRegression">Logistic Regression</option>
                <option value="Perceptron">Perceptron</option>
                <option value="LinearSVM">Linear SVM</option>
                <option value="RBFSVM">RBF SVM</option>
                <option value="NeuralNetwork">Neural Network (MLP)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Scaler:</span>
              <select
                value={selectedNormalization}
                onChange={(e) => setSelectedNormalization(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-cyan-400 font-semibold focus:outline-hidden"
              >
                <option value="Standard">StandardScaler</option>
                <option value="MinMax">MinMaxScaler</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {currentDatasetInfo.features.map((feat) => (
              <div key={feat.name} className="bg-slate-800/40 border border-slate-800 rounded-lg p-2.5 hover:border-slate-700 transition-colors">
                <div className="flex items-baseline justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-300 truncate" title={feat.label || feat.name}>
                    {feat.label || feat.name}
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {feat.name}
                  </span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={features[feat.name] !== undefined ? features[feat.name] : ''}
                  onChange={(e) => handleInputChange(feat.name, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-xs font-mono text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <span>Running Inference...</span>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  Predict Software Defect
                </>
              )}
            </button>
          </div>
        </form>

        {/* Prediction Results Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Defect Classification Result
            </h3>

            {prediction ? (
              <div className="space-y-4">
                {/* Result Hero Badge */}
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                  prediction.is_defective 
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' 
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                }`}>
                  <div className={`p-2 rounded-lg ${prediction.is_defective ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}>
                    {prediction.is_defective ? <AlertTriangle className="h-6 w-6 text-rose-400" /> : <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {prediction.label}
                    </div>
                    <div className="text-[11px] opacity-80">
                      Evaluated by {prediction.classifier} ({prediction.normalization} Scaler)
                    </div>
                  </div>
                </div>

                {/* Probability & Confidence Meters */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Defect Probability</span>
                      <span className="font-mono font-bold text-white">
                        {(prediction.defect_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${prediction.defect_probability > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${prediction.defect_probability * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Model Confidence</span>
                      <span className="font-mono font-bold text-indigo-400">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-700/60">
                    <span className="text-slate-400">Risk Severity:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                      prediction.risk_level === 'Critical' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : prediction.risk_level === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {prediction.risk_level} Risk
                    </span>
                  </div>
                </div>

                {/* Software Engineering Recommendations */}
                <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-indigo-300 mb-1">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                    Code Quality Recommendation
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {prediction.is_defective 
                      ? "High cyclomatic complexity and Halstead volume detected. Recommend modularizing decision pathways, extracting helper functions, and enforcing comprehensive unit test coverage."
                      : "Module software metrics fall within acceptable thresholds. Cyclomatic density and operand ratios indicate clean maintainability."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <ShieldAlert className="h-10 w-10 mx-auto mb-3 opacity-30 text-indigo-400" />
                <p className="text-xs font-medium text-slate-300 mb-1">No Prediction Run Yet</p>
                <p className="text-[11px] max-w-xs mx-auto">
                  Click "Load Defective Sample" or enter custom McCabe & Halstead metric values, then press "Predict Software Defect".
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Classification powered by trained scikit-learn models from original research.
          </div>
        </div>
      </div>
    </div>
  );
}
