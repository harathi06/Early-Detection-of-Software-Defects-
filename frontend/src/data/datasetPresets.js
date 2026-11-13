// Preset software metric values and features for JM1, MC1, PC3
export const DATASETS_INFO = {
  jm1: {
    name: "JM1",
    openMlId: 1053,
    description: "NASA ground system software written in C/C++. McCabe and Halstead features.",
    totalSamples: 10885,
    featuresCount: 21,
    targetCol: "defects",
    defectRate: 19.35,
    features: [
      { name: "loc", label: "Lines of Code (LOC)", group: "Volume", default: 35.0, desc: "McCabe's line count of that module" },
      { name: "v(g)", label: "Cyclomatic Complexity v(g)", group: "Complexity", default: 6.0, desc: "Number of linearly independent paths" },
      { name: "ev(g)", label: "Essential Complexity ev(g)", group: "Complexity", default: 1.0, desc: "Measure of unstructuredness" },
      { name: "iv(g)", label: "Design Complexity iv(g)", group: "Complexity", default: 3.0, desc: "Complexity of module calling hierarchy" },
      { name: "n", label: "Halstead Length (n)", group: "Halstead", default: 140.0, desc: "Total operators + operands" },
      { name: "v", label: "Halstead Volume (v)", group: "Halstead", default: 750.0, desc: "Module size in bits" },
      { name: "l", label: "Halstead Level (l)", group: "Halstead", default: 0.08, desc: "Program level abstraction" },
      { name: "d", label: "Halstead Difficulty (d)", group: "Halstead", default: 12.5, desc: "Error-proneness of implementation" },
      { name: "i", label: "Halstead Intelligence (i)", group: "Halstead", default: 60.0, desc: "Information content" },
      { name: "e", label: "Halstead Effort (e)", group: "Halstead", default: 9375.0, desc: "Mental effort required to develop" },
      { name: "b", label: "Halstead Error Est. (b)", group: "Halstead", default: 0.25, desc: "Estimated number of delivered defects" },
      { name: "t", label: "Halstead Time (t)", group: "Halstead", default: 520.0, desc: "Time required to code module in seconds" },
      { name: "lOCode", label: "Lines of Code", group: "Volume", default: 28.0, desc: "Physical executable lines" },
      { name: "lOComment", label: "Lines of Comments", group: "Volume", default: 4.0, desc: "Commented lines in module" },
      { name: "lOBlank", label: "Blank Lines", group: "Volume", default: 3.0, desc: "Empty whitespace lines" },
      { name: "locCodeAndComment", label: "Code & Comment Lines", group: "Volume", default: 0.0, desc: "Lines containing both code and comments" },
      { name: "uniq_Op", label: "Unique Operators", group: "Halstead", default: 18.0, desc: "Number of distinct operators" },
      { name: "uniq_Opnd", label: "Unique Operands", group: "Halstead", default: 24.0, desc: "Number of distinct variables/constants" },
      { name: "total_Op", label: "Total Operators", group: "Halstead", default: 85.0, desc: "Total operator count" },
      { name: "total_Opnd", label: "Total Operands", group: "Halstead", default: 55.0, desc: "Total operand count" },
      { name: "branchCount", label: "Branch Count", group: "Complexity", default: 11.0, desc: "Total decision points and branches" }
    ],
    sampleDefective: {
      loc: 185.0, "v(g)": 28.0, "ev(g)": 14.0, "iv(g)": 18.0, n: 820.0, v: 5400.0, l: 0.02, d: 45.0,
      i: 120.0, e: 243000.0, b: 1.8, t: 13500.0, lOCode: 145.0, lOComment: 20.0, lOBlank: 20.0,
      locCodeAndComment: 2.0, uniq_Op: 35.0, uniq_Opnd: 85.0, total_Op: 510.0, total_Opnd: 310.0, branchCount: 55.0
    },
    sampleClean: {
      loc: 14.0, "v(g)": 2.0, "ev(g)": 1.0, "iv(g)": 1.0, n: 38.0, v: 165.0, l: 0.22, d: 4.5,
      i: 36.6, e: 742.0, b: 0.05, t: 41.2, lOCode: 10.0, lOComment: 2.0, lOBlank: 2.0,
      locCodeAndComment: 0.0, uniq_Op: 9.0, uniq_Opnd: 12.0, total_Op: 22.0, total_Opnd: 16.0, branchCount: 3.0
    }
  },
  mc1: {
    name: "MC1",
    openMlId: 1056,
    description: "NASA video guidance system written in C & C++. High class imbalance (0.72% defect rate).",
    totalSamples: 9466,
    featuresCount: 38,
    targetCol: "c",
    defectRate: 0.72,
    features: [
      { name: "CYCLOMATIC_COMPLEXITY", label: "Cyclomatic Complexity", group: "Complexity", default: 4.0 },
      { name: "DESIGN_COMPLEXITY", label: "Design Complexity", group: "Complexity", default: 2.0 },
      { name: "ESSENTIAL_COMPLEXITY", label: "Essential Complexity", group: "Complexity", default: 1.0 },
      { name: "LOC_TOTAL", label: "LOC Total", group: "Volume", default: 25.0 },
      { name: "BRANCH_COUNT", label: "Branch Count", group: "Complexity", default: 7.0 },
      { name: "HALSTEAD_VOLUME", label: "Halstead Volume", group: "Halstead", default: 350.0 },
      { name: "HALSTEAD_EFFORT", label: "Halstead Effort", group: "Halstead", default: 4200.0 }
    ],
    sampleDefective: {
      CYCLOMATIC_COMPLEXITY: 34.0, DESIGN_COMPLEXITY: 22.0, ESSENTIAL_COMPLEXITY: 16.0,
      LOC_TOTAL: 240.0, BRANCH_COUNT: 67.0, HALSTEAD_VOLUME: 8900.0, HALSTEAD_EFFORT: 380000.0
    },
    sampleClean: {
      CYCLOMATIC_COMPLEXITY: 2.0, DESIGN_COMPLEXITY: 1.0, ESSENTIAL_COMPLEXITY: 1.0,
      LOC_TOTAL: 15.0, BRANCH_COUNT: 3.0, HALSTEAD_VOLUME: 120.0, HALSTEAD_EFFORT: 550.0
    }
  },
  pc3: {
    name: "PC3",
    openMlId: 1050,
    description: "NASA flight software for earth-orbiting satellite flight system (C language).",
    totalSamples: 1563,
    featuresCount: 37,
    targetCol: "c",
    defectRate: 10.24,
    features: [
      { name: "CYCLOMATIC_COMPLEXITY", label: "Cyclomatic Complexity", group: "Complexity", default: 5.0 },
      { name: "DESIGN_COMPLEXITY", label: "Design Complexity", group: "Complexity", default: 3.0 },
      { name: "ESSENTIAL_COMPLEXITY", label: "Essential Complexity", group: "Complexity", default: 1.0 },
      { name: "LOC_TOTAL", label: "LOC Total", group: "Volume", default: 38.0 },
      { name: "BRANCH_COUNT", label: "Branch Count", group: "Complexity", default: 9.0 },
      { name: "HALSTEAD_VOLUME", label: "Halstead Volume", group: "Halstead", default: 620.0 },
      { name: "HALSTEAD_EFFORT", label: "Halstead Effort", group: "Halstead", default: 7500.0 }
    ],
    sampleDefective: {
      CYCLOMATIC_COMPLEXITY: 26.0, DESIGN_COMPLEXITY: 15.0, ESSENTIAL_COMPLEXITY: 11.0,
      LOC_TOTAL: 190.0, BRANCH_COUNT: 51.0, HALSTEAD_VOLUME: 6400.0, HALSTEAD_EFFORT: 185000.0
    },
    sampleClean: {
      CYCLOMATIC_COMPLEXITY: 3.0, DESIGN_COMPLEXITY: 2.0, ESSENTIAL_COMPLEXITY: 1.0,
      LOC_TOTAL: 18.0, BRANCH_COUNT: 5.0, HALSTEAD_VOLUME: 210.0, HALSTEAD_EFFORT: 1200.0
    }
  }
};
