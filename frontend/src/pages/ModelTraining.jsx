import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Target, 
  Sparkles,
  BarChart2,
  RefreshCw,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { trainModelApi } from '../api/client';

export default function ModelTraining({ activeDataset, setActiveDataset }) {
  const [selectedClassifier, setSelectedClassifier] = useState('RandomForest');
  const [selectedNormalization, setSelectedNormalization] = useState('Standard');
  const [training, setTraining] = useState(false);
  const [results, setResults] = useState(null);

  const classifiers = [
    { id: 'LogisticRegression', name: 'Logistic Regression', type: 'Linear Model', desc: 'L2-regularized logistic loss' },
    { id: 'Perceptron', name: 'Perceptron', type: 'Single-Layer', desc: 'Classic linear binary classifier' },
    { id: 'LinearSVM', name: 'Linear SVM', type: 'Max-Margin', desc: 'Support vector machine with linear kernel' },
    { id: 'RBFSVM', name: 'RBF SVM', type: 'Kernel Method', desc: 'Radial basis function kernel mapping' },
    { id: 'DecisionTree', name: 'Decision Tree', type: 'Rule-Based', desc: 'Information gain / Gini partitioning' },
    { id: 'RandomForest', name: 'Random Forest', type: 'Ensemble', desc: 'Bootstrap aggregated decision forests' },
    { id: 'NeuralNetwork', name: 'Feed-Forward NN', type: 'Deep Learning', desc: 'MLP with 100 hidden neurons' }
  ];

  const normalizations = [
    { id: 'None', name: 'No Normalization', desc: 'Raw, unscaled feature values' },
    { id: 'MinMax', name: 'Min-Max Normalization', desc: 'Scales all features to [0, 1]' },
    { id: 'Standard', name: 'Feature Standardization', desc: 'Zero mean, unit variance scaling' }
  ];

  const handleTrain = async () => {
    setTraining(true);
    try {
      const res = await trainModelApi(activeDataset, selectedClassifier, selectedNormalization);
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              Configure Training Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select classifier, normalization method, and run 5-fold cross validation.
            </p>
          </div>

          <button
            onClick={handleTrain}
            disabled={training}
            className={`
              px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg
              ${training 
                ? 'bg-indigo-700/50 text-indigo-200 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'}
            `}
          >
            {training ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Training 5 Folds...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                Train Model (5-Fold CV)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classifiers List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Select Algorithm (7 Options)
          </h3>
          <div className="space-y-2">
            {classifiers.map((clf) => {
              const isSelected = selectedClassifier === clf.id;
              return (
                <div
                  key={clf.id}
                  onClick={() => setSelectedClassifier(clf.id)}
                  className={`
                    p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between
                    ${isSelected 
                      ? 'bg-indigo-600/15 border-indigo-500/50 text-white' 
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'}
                  `}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs">{clf.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {clf.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{clf.desc}</div>
                  </div>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Normalization & Dataset */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Feature Normalization (3 Options)
            </h3>
            <div className="space-y-2.5">
              {normalizations.map((norm) => {
                const isSelected = selectedNormalization === norm.id;
                return (
                  <div
                    key={norm.id}
                    onClick={() => setSelectedNormalization(norm.id)}
                    className={`
                      p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between
                      ${isSelected 
                        ? 'bg-indigo-600/15 border-indigo-500/50 text-white' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'}
                    `}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-200">{norm.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{norm.desc}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dataset Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Target Dataset
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['jm1', 'mc1', 'pc3'].map((ds) => (
                <button
                  key={ds}
                  onClick={() => setActiveDataset(ds)}
                  className={`
                    py-2.5 px-3 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer
                    ${activeDataset === ds 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}
                  `}
                >
                  {ds}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results View */}
      {results && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Training Complete: {results.classifier} + {results.normalization} Normalization
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                5-Fold Cross Validation evaluated on {results.dataset.toUpperCase()} dataset ({results.total_training_duration}s total fit time)
              </p>
            </div>
            <div className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CV Folds: {results.cv_folds}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
              <div className="text-xs text-slate-400">Mean Accuracy</div>
              <div className="text-2xl font-bold text-white mt-1 font-mono">
                {(results.mean_accuracy * 100).toFixed(2)}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">±{(results.std_accuracy * 100).toFixed(2)}% std</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
              <div className="text-xs text-slate-400">Mean F1-Score</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                {results.mean_f1.toFixed(4)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">±{results.std_f1.toFixed(4)} std</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
              <div className="text-xs text-slate-400">Mean G-Mean Score</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono">
                {results.mean_g_mean.toFixed(4)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">±{results.std_g_mean.toFixed(4)} std</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
              <div className="text-xs text-slate-400">Average Fit Time</div>
              <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">
                {results.mean_fit_time.toFixed(4)}s
              </div>
              <div className="text-[11px] text-slate-400 mt-1">per cross-validation fold</div>
            </div>
          </div>

          {/* Confusion Matrix and Fold Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Confusion Matrix */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Confusion Matrix (Hold-out Test Set)
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">True Negative (TN)</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {results.confusion_matrix.true_negative}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Correct Clean</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">False Positive (FP)</div>
                  <div className="text-xl font-bold text-rose-400 mt-1">
                    {results.confusion_matrix.false_positive}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Type I Error</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">False Negative (FN)</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">
                    {results.confusion_matrix.false_negative}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Type II Error (Defect Missed)</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">True Positive (TP)</div>
                  <div className="text-xl font-bold text-indigo-400 mt-1">
                    {results.confusion_matrix.true_positive}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Detected Defect</div>
                </div>
              </div>
            </div>

            {/* Fold by Fold Scores */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                5-Fold Cross Validation Scores
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="py-1.5 px-2">Fold</th>
                      <th className="py-1.5 px-2">Accuracy</th>
                      <th className="py-1.5 px-2">F1-Score</th>
                      <th className="py-1.5 px-2">G-Mean</th>
                      <th className="py-1.5 px-2">Fit Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {results.fold_scores.map((fold) => (
                      <tr key={fold.fold} className="hover:bg-slate-800">
                        <td className="py-1.5 px-2 text-slate-300">Fold {fold.fold}</td>
                        <td className="py-1.5 px-2 text-white">{(fold.accuracy * 100).toFixed(1)}%</td>
                        <td className="py-1.5 px-2 text-emerald-400">{fold.f1.toFixed(3)}</td>
                        <td className="py-1.5 px-2 text-cyan-400">{fold.g_mean.toFixed(3)}</td>
                        <td className="py-1.5 px-2 text-amber-400">{fold.fit_time}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
