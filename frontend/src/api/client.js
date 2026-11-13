// Unified API Client with transparent local backend connection and smart fallback
import { BENCHMARK_DATA } from '../data/benchmarkData';
import { DATASETS_INFO } from '../data/datasetPresets';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return { online: true, ...data };
    }
  } catch (err) {
    // Backend offline / not reachable
  }
  return { online: false, message: "Using Embedded ML Engine & Verified Benchmarks" };
}

export async function fetchDatasets() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/datasets`);
    if (res.ok) return await res.json();
  } catch (err) {}
  
  // Client-side fallback from verified data
  return Object.keys(DATASETS_INFO).map(key => {
    const info = DATASETS_INFO[key];
    return {
      name: key,
      target_column: info.targetCol,
      total_samples: info.totalSamples,
      features_count: info.featuresCount,
      features: info.features.map(f => f.name),
      defective_count: Math.round(info.totalSamples * (info.defectRate / 100)),
      clean_count: Math.round(info.totalSamples * (1 - info.defectRate / 100)),
      defect_rate: info.defectRate
    };
  });
}

export async function fetchComparison(dataset = 'jm1') {
  try {
    const res = await fetch(`${API_BASE_URL}/api/comparison?dataset=${dataset}`);
    if (res.ok) {
      const json = await res.json();
      return json.results;
    }
  } catch (err) {}
  
  return BENCHMARK_DATA[dataset.toLowerCase()] || BENCHMARK_DATA.jm1;
}

export async function trainModelApi(dataset, classifier, normalization) {
  const url = `${API_BASE_URL}/api/train`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataset, classifier, normalization })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Model training failed (${res.status}): ${errText}`);
  }
  return await res.json();
}

export async function predictDefectApi(dataset, classifier, normalization, features) {
  const url = `${API_BASE_URL}/api/predict`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataset, classifier, normalization, features })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Defect prediction failed (${res.status}): ${errText}`);
  }
  return await res.json();
}
