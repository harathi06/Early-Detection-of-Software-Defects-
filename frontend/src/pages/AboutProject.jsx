import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  ShieldCheck, 
  Code2, 
  Binary, 
  Scale, 
  Cpu, 
  Award
} from 'lucide-react';

export default function AboutProject() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-indigo-400" />
          About Software Defect Detection
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Software defect detection is a core discipline in automated software engineering. By extracting quantitative telemetry metrics—including McCabe cyclomatic complexity and Halstead software science attributes—machine learning models can predict fault-prone modules early in the software lifecycle, reducing post-release maintenance overhead and mission-critical system failures.
        </p>
      </div>

      {/* McCabe and Halstead Metrics Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-2">
            <Binary className="h-4 w-4" />
            McCabe Complexity Metrics
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Introduced by Thomas McCabe (1976), this suite calculates structural paths through source code:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong className="text-slate-200">v(g) Cyclomatic Complexity:</strong> Measures linearly independent execution paths ($v(g) = e - n + 2p$). High $v(g) &gt; 10$ indicates high defect probability.</li>
            <li><strong className="text-slate-200">ev(g) Essential Complexity:</strong> Quantifies unstructured code (spaghetti code / goto statements).</li>
            <li><strong className="text-slate-200">iv(g) Design Complexity:</strong> Measures decision paths within module calling hierarchies.</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-2">
            <Scale className="h-4 w-4" />
            Halstead Software Science
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Formulated by Maurice Halstead (1977), these measure software scale based on vocabulary:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong className="text-slate-200">Volume (V):</strong> Information content and storage size of code module.</li>
            <li><strong className="text-slate-200">Difficulty (D):</strong> Error-proneness of implementation and maintenance difficulty.</li>
            <li><strong className="text-slate-200">Effort (E):</strong> Mental effort required by programmers to develop the module.</li>
            <li><strong className="text-slate-200">Time (T):</strong> Estimated implementation time in seconds ($T = E / 18$).</li>
          </ul>
        </div>
      </div>

      {/* The Importance of G-Mean for Class Imbalance */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
          <Award className="h-4 w-4 text-emerald-400" />
          Why G-Mean is Essential for Defect Detection
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          In real-world NASA software systems (e.g., MC1), less than 1% of modules contain defects. A naive model that classifies every module as clean achieves 99.3% accuracy but detects zero bugs.
        </p>
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 mb-3">
          G-Mean = sqrt( Sensitivity * Specificity )
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The Geometric Mean (G-Mean) measures the balance between true positive detection rate and clean module specificity. It penalizes classifiers that perform poorly on the minority defective class, making it the benchmark standard in software defect research.
        </p>
      </div>

      {/* Author Attribution & License */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            Project Attribution & MIT License
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Open Source
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          This web application is built upon the machine learning research and experiments created by <strong>Dimitrios Iatropoulos</strong> in collaboration with <strong>Panagiotis Ioannou</strong>.
        </p>

        <div className="flex flex-wrap gap-4 text-xs font-medium">
          <a
            href="https://github.com/Dimitrios-Iatropoulos/Software-Defect-Detection.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Original GitHub Repository <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://www.openml.org/search?type=data&status=active&id=1053"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300"
          >
            NASA JM1 Dataset on OpenML <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* MIT License Box */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 leading-relaxed">
          <div className="text-slate-200 font-semibold mb-1">MIT License</div>
          <div className="text-slate-400 mb-2">Copyright (c) 2024 Dimitrios Iatropoulos</div>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
        </div>
      </div>
    </div>
  );
}
