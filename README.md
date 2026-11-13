# Software Defect Detection Platform 🚀

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Vercel Deployed](https://img.shields.io/badge/Vercel-Deployed-black.svg?logo=vercel&logoColor=white)](https://vercel.com/)

A modern, interactive AI/ML web application for automated **Software Defect Detection**, predicting fault-prone software modules using McCabe cyclomatic complexity and Halstead software science metrics. 

Based on research and experiments by **Dimitrios Iatropoulos** & **Panagiotis Ioannou**, converted into a complete, professional production web dashboard with live model training, defect risk inference, and empirical model benchmarks.

---

## 🌟 Key Features

- **📊 Modern AI/ML Analytics Dashboard**: Dark-themed, responsive dashboard displaying model performance KPIs, dataset distributions, and recent prediction logs.
- **📁 Dataset Management & CSV Upload**:
  - Explore NASA Metrics Data Program (MDP) datasets: **JM1** (10,885 modules), **MC1** (9,466 modules), and **PC3** (1,563 modules).
  - Inspect sample records, attribute dictionaries, class imbalance distributions, and missing value handling.
  - Upload custom CSV datasets with automatic numeric validation.
- **⚙️ Live Model Training (5-Fold Cross Validation)**:
  - Interactive algorithm selection (7 classifiers) and normalization techniques (3 scalers).
  - Real-time 5-fold cross-validation execution with mean accuracy, F1-score, G-mean, and fit time.
  - Interactive confusion matrix visualization and fold-by-fold score tables.
- **🛡️ Real-Time Defect Prediction Engine**:
  - Enter module McCabe & Halstead metric vectors.
  - 1-Click presets (*Load Sample Defective Module*, *Load Sample Clean Module*) for instant testing.
  - Confidence scoring, defect probability meter, risk level categorization (*Low, Medium, High, Critical*), and actionable code refactoring recommendations.
- **📈 Multi-Model Comparative Benchmarking**:
  - Recharts grouped bar charts comparing 7 classifiers across 3 normalizations.
  - Sortable and filterable 21-pipeline comparison matrix with verified empirical results from the original research.
- **📖 Educational & Attribution Module**:
  - In-depth background on McCabe paths and Halstead vocabulary metrics.
  - Mathematical formulation explaining why Geometric Mean (**G-Mean**) is the essential metric for imbalanced defect datasets.
  - Original research attribution and MIT License preservation.

---

## 🧠 Machine Learning Architecture

### Classifiers
1. **Logistic Regression** (`LogisticRegression(max_iter=1000, random_state=42)`)
2. **Perceptron** (`Perceptron(max_iter=100)`)
3. **Linear Support Vector Machine** (`LinearSVC(C=1, max_iter=200, dual=False, random_state=42)`)
4. **RBF Kernel Support Vector Machine** (`SVC(kernel='rbf', gamma='scale', C=1, max_iter=50000)`)
5. **Decision Tree** (`DecisionTreeClassifier(random_state=42)`)
6. **Random Forest** (`RandomForestClassifier(random_state=42)`)
7. **Feed-Forward Neural Network** (`MLPClassifier(hidden_layer_sizes=(100,), max_iter=1000, random_state=42)`)

### Normalization Techniques
- **No Normalization** (Raw features)
- **Min-Max Normalization** (`MinMaxScaler()`)
- **Feature Standardization** (`StandardScaler()`)

### Datasets (NASA Metrics Data Program via OpenML)
| Dataset | OpenML ID | Modules | Features | Target Column | Defect Rate | Description |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **JM1** | 1053 | 10,885 | 21 | `defects` | 19.35% | NASA ground system written in C/C++ |
| **MC1** | 1056 | 9,466 | 38 | `c` | 0.72% | NASA video guidance system (Extreme imbalance) |
| **PC3** | 1050 | 1,563 | 37 | `c` | 10.24% | Earth-orbiting satellite flight software (C) |

---

## 🏗️ Project Architecture

```
Early-Detection-of-Software-Defects-/
├── backend/                            # Python FastAPI Service
│   ├── main.py                         # API endpoints, CORS, routers
│   ├── ml/
│   │   ├── models.py                   # 7 classifiers & 3 scalers
│   │   ├── preprocessor.py             # Data loading & cleaning
│   │   ├── trainer.py                  # 5-fold CV & G-Mean evaluation
│   │   ├── predictor.py                # Prediction & confidence inference
│   │   └── benchmark_cache.py          # Exact notebook CV benchmark results
│   ├── data/                           # JM1, MC1, PC3 CSV datasets
│   ├── requirements.txt                # Python backend dependencies
│   ├── render.yaml                     # Render 1-click deployment
│   └── Procfile                        # Production WSGI process definition
├── frontend/                           # React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/                 # Sidebar, Header, StatCard
│   │   ├── pages/                      # Dashboard, Datasets, Training, Predict, Compare, About
│   │   ├── data/                       # Benchmark data & dataset presets
│   │   └── api/                        # API client with offline fallback
│   ├── vercel.json                     # Vercel deployment configuration
│   └── package.json
├── original_repo/                      # Preserved original ML research
│   ├── MLSD.ipynb                      # Original research notebook
│   ├── README.md
│   └── LICENSE
├── LICENSE                             # MIT License
└── README.md                           # Documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (3.10+) and **pip**

### 1. Clone the Repository
```bash
git clone https://github.com/harathi06/Early-Detection-of-Software-Defects-.git
cd Early-Detection-of-Software-Defects-
```

### 2. Start the Backend API
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 3. Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## ☁️ Deployment Guide

### Frontend Deployment (Vercel)
The React application is pre-configured for Vercel deployment with `frontend/vercel.json`:
1. Connect your GitHub repository to Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. (Optional) Set Environment Variable `VITE_API_URL` to your hosted backend API URL.

### Backend Deployment (Render / Railway / Hugging Face Spaces)
The backend includes `render.yaml` and `Procfile`:
1. Create a Web Service on [Render](https://render.com).
2. Set Root Directory to `backend`.
3. Build Command: `pip install -r requirements.txt`.
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.

---

## 📜 Attribution & License

- Original Machine Learning Research by **[Dimitrios Iatropoulos](https://github.com/Dimitrios-Iatropoulos)** in collaboration with **Panagiotis Ioannou**.
- Original Repository: [Software-Defect-Detection](https://github.com/Dimitrios-Iatropoulos/Software-Defect-Detection.git)
- Licensed under the **MIT License** - see [LICENSE](LICENSE) for details.
