import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { fetchComparison } from '../api/client';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function ModelComparison({ activeDataset, setActiveDataset }) {
  const [benchmarks, setBenchmarks] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('f1');
  const [selectedNormalization, setSelectedNormalization] = useState('All');
  const [sortBy, setSortBy] = useState('f1');
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchComparison(activeDataset);
      setBenchmarks(data);
      setLoading(false);
    }
    load();
  }, [activeDataset]);

  const metricsConfig = {
    accuracy: { label: 'Accuracy', unit: '%', mult: 100 },
    f1: { label: 'F1-Score', unit: '', mult: 1 },
    g_mean: { label: 'G-Mean', unit: '', mult: 1 },
    fit_time: { label: 'Fit Time', unit: 's', mult: 1 }
  };

  // Grouped data for the 7 classifiers across 3 normalizations
  const classifiersList = [
    'LogisticRegression', 'Perceptron', 'LinearSVM', 'RBFSVM', 
    'DecisionTree', 'RandomForest', 'NeuralNetwork'
  ];

  const chartData = classifiersList.map(clf => {
    const noneItem = benchmarks.find(b => b.classifier === clf && b.normalization === 'None');
    const minmaxItem = benchmarks.find(b => b.classifier === clf && b.normalization === 'MinMax');
    const stdItem = benchmarks.find(b => b.classifier === clf && b.normalization === 'Standard');

    const m = selectedMetric;
    const mult = metricsConfig[m].mult;

    return {
      name: clf.replace('Regression', 'Reg').replace('Classifier', ''),
      None: noneItem ? +(noneItem[m] * mult).toFixed(3) : 0,
      MinMax: minmaxItem ? +(minmaxItem[m] * mult).toFixed(3) : 0,
      Standard: stdItem ? +(stdItem[m] * mult).toFixed(3) : 0
    };
  });

  // Table filtering and sorting
  const filteredTable = benchmarks
    .filter(b => selectedNormalization === 'All' || b.normalization === selectedNormalization)
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      return sortAsc ? valA - valB : valB - valA;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Insights */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              Machine Learning Benchmark Study ({activeDataset.toUpperCase()})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative analysis of 7 classifiers across 3 normalization techniques. Real empirical 5-fold cross validation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Dataset:</span>
            <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700">
              {['jm1', 'mc1', 'pc3'].map((ds) => (
                <button
                  key={ds}
                  onClick={() => setActiveDataset(ds)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold uppercase transition-all cursor-pointer ${
                    activeDataset === ds ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ds}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {metricsConfig[selectedMetric].label} Comparison Across Normalizations
            </h3>
            <p className="text-xs text-slate-400">
              Blue: No Normalization • Amber: Min-Max Scaler • Green: Feature Standardization
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            {Object.keys(metricsConfig).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  selectedMetric === key 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {metricsConfig[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Bar Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="None" fill="#3b82f6" name="None" radius={[3, 3, 0, 0]} />
              <Bar dataKey="MinMax" fill="#f59e0b" name="Min-Max" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Standard" fill="#10b981" name="Standard" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Full 21-Model Evaluation Table</h3>
            <p className="text-xs text-slate-400">Click table headers to sort by performance metrics</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedNormalization}
              onChange={(e) => setSelectedNormalization(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Normalizations</option>
              <option value="None">No Normalization</option>
              <option value="MinMax">Min-Max Normalization</option>
              <option value="Standard">Feature Standardization</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-sans">
                <th className="py-2.5 px-3">Classifier</th>
                <th className="py-2.5 px-3">Normalization</th>
                <th 
                  onClick={() => handleSort('accuracy')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">Accuracy <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th 
                  onClick={() => handleSort('f1')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">F1-Score <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th 
                  onClick={() => handleSort('g_mean')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">G-Mean <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th 
                  onClick={() => handleSort('fit_time')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">Fit Time <ArrowUpDown className="h-3 w-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-slate-200 font-sans font-semibold">{row.classifier}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {row.normalization}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-indigo-400">{(row.accuracy * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{row.f1.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-cyan-400">{row.g_mean.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-amber-400">{row.fit_time.toFixed(4)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
