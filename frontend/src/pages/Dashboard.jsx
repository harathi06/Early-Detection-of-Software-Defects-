import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp, 
  BarChart2, 
  Play, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { DATASETS_INFO } from '../data/datasetPresets';
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

export default function Dashboard({ setActivePage, activeDataset, setActiveDataset }) {
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchComparison(activeDataset);
      setBenchmarks(data);
      setLoading(false);
    }
    loadData();
  }, [activeDataset]);

  // Aggregate top chart data for standard normalization
  const chartData = benchmarks
    .filter(b => b.normalization === 'Standard')
    .map(b => ({
      name: b.classifier.replace('Regression', 'Reg').replace('Classifier', ''),
      Accuracy: +(b.accuracy * 100).toFixed(1),
      F1: +(b.f1 * 100).toFixed(1),
      GMean: +(b.g_mean * 100).toFixed(1)
    }));

  const recentPredictions = [
    { module: 'org.apache.lucene.index.SegmentReader', loc: 142, vg: 22, prob: 0.84, status: 'Defective', risk: 'Critical' },
    { module: 'com.nasa.flight.telemetry.Parser', loc: 34, vg: 4, prob: 0.12, status: 'Clean', risk: 'Low' },
    { module: 'net.security.auth.TokenValidator', loc: 68, vg: 11, prob: 0.58, status: 'Defective', risk: 'High' },
    { module: 'io.buffer.CircularByteStream', loc: 19, vg: 2, prob: 0.05, status: 'Clean', risk: 'Low' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Machine Learning Software Quality Assurance
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Software Defect Detection Platform
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Automated software defect classification trained on NASA MDP telemetry datasets (JM1, MC1, PC3). Evaluates code modules using McCabe cyclomatic complexity and Halstead software science metrics.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setActivePage('prediction')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <ShieldAlert className="h-4 w-4" />
              Test Defect Predictor
            </button>
            <button
              onClick={() => setActivePage('training')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Cpu className="h-4 w-4" />
              Train Algorithm (5-Fold CV)
            </button>
            <button
              onClick={() => setActivePage('comparison')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <BarChart2 className="h-4 w-4" />
              View 21 Benchmark Models
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="ML Algorithms"
          value="7 Classifiers"
          subtitle="Trees, SVMs, Logistic, Neural Net"
          icon={Cpu}
          color="indigo"
          badge="Scikit-Learn"
        />
        <StatCard
          title="Available Datasets"
          value="3 NASA MDP"
          subtitle="JM1, MC1, PC3 (21,914 total rows)"
          icon={Database}
          color="cyan"
          badge="OpenML"
        />
        <StatCard
          title="Evaluated Pipelines"
          value="21 Combinations"
          subtitle="7 models × 3 normalizations"
          icon={Layers}
          color="purple"
          badge="5-Fold CV"
        />
        <StatCard
          title="Top G-Mean Score"
          value="74.26%"
          subtitle="Decision Tree (Min-Max scaled on MC1)"
          icon={TrendingUp}
          color="emerald"
          badge="Balanced metric"
        />
      </div>

      {/* Performance Chart and Dataset Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Model Overview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Algorithm Performance ({activeDataset.toUpperCase()})</h3>
              <p className="text-xs text-slate-400">Accuracy & F1-Score with Feature Standardization</p>
            </div>
            <button
              onClick={() => setActivePage('comparison')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              Full Benchmark <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Accuracy" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="F1" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="GMean" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dataset Quick Switcher Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">NASA MDP Datasets</h3>
            <p className="text-xs text-slate-400 mb-4">Click to switch active benchmark dataset</p>

            <div className="space-y-2.5">
              {Object.keys(DATASETS_INFO).map((key) => {
                const info = DATASETS_INFO[key];
                const isSelected = activeDataset === key;
                return (
                  <div
                    key={key}
                    onClick={() => setActiveDataset(key)}
                    className={`
                      p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between
                      ${isSelected 
                        ? 'bg-indigo-600/10 border-indigo-500/40 text-white' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'}
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{info.name}</span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500 text-white rounded-full font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {info.totalSamples.toLocaleString()} modules • {info.featuresCount} metrics
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold text-amber-400">
                        {info.defectRate}%
                      </div>
                      <div className="text-[10px] text-slate-400">defect rate</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <button
              onClick={() => setActivePage('datasets')}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Database className="h-3.5 w-3.5 text-indigo-400" />
              Manage Datasets & Upload CSV
            </button>
          </div>
        </div>
      </div>

      {/* Recent Predictions Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Defect Inspection Activity</h3>
            <p className="text-xs text-slate-400">Telemetry logs from defect classification runs</p>
          </div>
          <button
            onClick={() => setActivePage('prediction')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
          >
            Open Predictor →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Module Identifier</th>
                <th className="py-2.5 px-3">Lines of Code (LOC)</th>
                <th className="py-2.5 px-3">Cyclomatic v(g)</th>
                <th className="py-2.5 px-3">Defect Probability</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {recentPredictions.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-slate-200 font-sans font-medium">{row.module}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.loc}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.vg}</td>
                  <td className="py-2.5 px-3 text-slate-300">{(row.prob * 100).toFixed(0)}%</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans font-medium ${
                      row.status === 'Defective' 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {row.status === 'Defective' ? <ShieldAlert className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`text-[11px] font-medium ${
                      row.risk === 'Critical' ? 'text-rose-400' : row.risk === 'High' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
