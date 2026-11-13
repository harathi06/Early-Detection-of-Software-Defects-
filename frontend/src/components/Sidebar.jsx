import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Cpu, 
  ShieldAlert, 
  BarChart3, 
  BookOpen, 
  Code2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'datasets', label: 'Dataset Explorer', icon: Database, badge: '3 Datasets' },
    { id: 'training', label: 'Model Training', icon: Cpu, badge: '5-Fold CV' },
    { id: 'prediction', label: 'Defect Prediction', icon: ShieldAlert, badge: 'Live Inference' },
    { id: 'comparison', label: 'Model Benchmark', icon: BarChart3, badge: '21 Models' },
    { id: 'about', label: 'About & Metrics', icon: BookOpen, badge: 'MIT' }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              DefectLens <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
            </div>
            <div className="text-[11px] text-slate-400">Software Defect ML</div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-500/40 text-indigo-100' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Project Attribution Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs">
            <div className="font-medium text-slate-200 flex items-center justify-between">
              <span>NASA MDP Benchmark</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">
              Based on research by D. Iatropoulos & P. Ioannou (MIT License).
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
