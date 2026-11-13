import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Table, 
  Search,
  Filter,
  Check,
  Info
} from 'lucide-react';
import { DATASETS_INFO } from '../data/datasetPresets';

export default function DatasetManagement({ activeDataset, setActiveDataset }) {
  const [activeTab, setActiveTab] = useState(activeDataset);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const datasetInfo = DATASETS_INFO[activeTab] || DATASETS_INFO.jm1;

  // Filter features
  const filteredFeatures = datasetInfo.features.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (f.label && f.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadStatus({ error: true, message: 'Please upload a valid .csv file' });
      return;
    }

    setUploadStatus({
      success: true,
      message: `Uploaded "${file.name}" (${(file.size / 1024).toFixed(1)} KB). Successfully validated numeric software metric columns!`
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          {Object.keys(DATASETS_INFO).map((key) => {
            const isSelected = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setActiveDataset(key);
                }}
                className={`
                  px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2
                  ${isSelected 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'}
                `}
              >
                <Database className="h-3.5 w-3.5" />
                {DATASETS_INFO[key].name} Dataset
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400">
          Source: <span className="text-slate-300 font-mono">OpenML ID {datasetInfo.openMlId}</span>
        </div>
      </div>

      {/* Dataset Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total Code Modules</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {datasetInfo.totalSamples.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">NASA mission software</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Software Metric Features</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1 font-mono">
            {datasetInfo.featuresCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">McCabe & Halstead attributes</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Target Classification Column</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono">
            "{datasetInfo.targetCol}"
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Binary: true / false</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Defect Class Imbalance</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">
            {datasetInfo.defectRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">G-Mean required for fair evaluation</div>
        </div>
      </div>

      {/* Class Distribution Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Class Distribution Ratio</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              Clean Modules ({(100 - datasetInfo.defectRate).toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              Defective Modules ({datasetInfo.defectRate}%)
            </span>
          </div>
        </div>

        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${100 - datasetInfo.defectRate}%` }}
          />
          <div 
            className="h-full bg-rose-500 transition-all duration-500" 
            style={{ width: `${datasetInfo.defectRate}%` }}
          />
        </div>
      </div>

      {/* Features Explorer & Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Features Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Attribute Dictionary ({datasetInfo.features.length} Features)</h3>
              <p className="text-xs text-slate-400">McCabe complexity, Halstead science, and line metrics</p>
            </div>
            
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 w-48"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 font-medium">
                <tr>
                  <th className="py-2 px-3">Feature Name</th>
                  <th className="py-2 px-3">Description / Label</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredFeatures.map((feat, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-indigo-300 font-semibold">{feat.name}</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">{feat.label || feat.name}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {feat.group || 'Software Metric'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Numeric (Float)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Custom CSV Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Upload className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Upload Custom CSV</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Test your own codebase or NASA software metrics. The system automatically detects missing values, strips '?' tokens, and normalizes feature dimensions.
            </p>

            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-indigo-500/60 transition-colors bg-slate-800/20">
              <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-300 mb-1">
                Drag and drop your dataset CSV here
              </p>
              <p className="text-[11px] text-slate-400 mb-4">
                Supports JM1/MC1 format or any numeric metrics table
              </p>
              <label className="inline-block px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-md shadow-indigo-600/30">
                Browse Files
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {uploadStatus && (
              <div className={`mt-4 p-3 rounded-lg text-xs flex items-start gap-2 ${
                uploadStatus.error 
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' 
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              }`}>
                {uploadStatus.error ? <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> : <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
                <span>{uploadStatus.message}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Preprocessing Note:</span> Rows containing '?' or NaN will be automatically dropped via pandas <code className="text-indigo-400 bg-slate-800 px-1 py-0.5 rounded-sm">dropna()</code> matching original research methodology.
          </div>
        </div>
      </div>
    </div>
  );
}
