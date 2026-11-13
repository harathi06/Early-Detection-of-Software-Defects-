import React from 'react';
import { Menu, Code2, ExternalLink, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  activePage, 
  setIsMobileOpen, 
  backendStatus, 
  activeDataset, 
  setActiveDataset 
}) {
  const pageTitles = {
    dashboard: { title: 'Dashboard Overview', desc: 'Predictive software quality insights and model statistics' },
    datasets: { title: 'Dataset Management', desc: 'Explore NASA MDP metrics, missing values, and custom CSV uploads' },
    training: { title: 'Model Training & Evaluation', desc: 'Run 5-Fold Cross Validation with G-Mean and F1-Score' },
    prediction: { title: 'Defect Prediction Engine', desc: 'Evaluate software modules using McCabe & Halstead metric vectors' },
    comparison: { title: 'Algorithm Comparison Benchmark', desc: 'Comparative study across 7 classifiers and 3 normalization techniques' },
    about: { title: 'About Software Defect Detection', desc: 'Domain background, mathematical metrics, and project attribution' }
  };

  const current = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-white tracking-tight leading-tight m-0">
            {current.title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block m-0">
            {current.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Dataset Selector */}
        <div className="hidden sm:flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs">
          <span className="text-slate-400 mr-2 font-medium">Dataset:</span>
          <select 
            value={activeDataset} 
            onChange={(e) => setActiveDataset(e.target.value)}
            className="bg-transparent text-indigo-400 font-semibold focus:outline-hidden cursor-pointer"
          >
            <option value="jm1" className="bg-slate-900 text-white">JM1 (10,885 modules)</option>
            <option value="mc1" className="bg-slate-900 text-white">MC1 (9,466 modules)</option>
            <option value="pc3" className="bg-slate-900 text-white">PC3 (1,563 modules)</option>
          </select>
        </div>

        {/* Backend Status Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700">
          <span className={`h-2 w-2 rounded-full ${backendStatus?.online ? 'bg-emerald-400 shadow-xs shadow-emerald-400' : 'bg-cyan-400'}`}></span>
          <span className="text-slate-300 text-[11px]">
            {backendStatus?.online ? 'API Online' : 'Client Mode'}
          </span>
        </div>

        {/* GitHub link */}
        <a 
          href="https://github.com/harathi06/software-defect-detection-ml" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="View GitHub Repository"
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        </a>
      </div>
    </header>
  );
}
