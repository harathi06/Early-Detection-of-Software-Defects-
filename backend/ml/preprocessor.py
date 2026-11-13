"""
Dataset loading, preprocessing, cleaning, and validation matching original notebook logic.
"""
import os
import pandas as pd
import numpy as np

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

DATASET_CONFIGS = {
    'jm1': {'target_col': 'defects', 'filename': 'jm1.csv'},
    'mc1': {'target_col': 'c', 'filename': 'mc1.csv'},
    'pc3': {'target_col': 'c', 'filename': 'pc3.csv'}
}


def load_dataset(dataset_name: str, custom_file_path: str = None):
    """
    Loads dataset, handles '?' as NaN, drops missing rows, returns X (DataFrame) and y (Series 0/1).
    """
    if custom_file_path and os.path.exists(custom_file_path):
        df = pd.read_csv(custom_file_path, na_values='?')
        # identify target column: last column or common names
        target_col = None
        for col in ['defects', 'c', 'defective', 'defect', 'target', 'class']:
            if col in df.columns:
                target_col = col
                break
        if target_col is None:
            target_col = df.columns[-1]
    else:
        name = dataset_name.lower()
        if name not in DATASET_CONFIGS:
            raise ValueError(f"Dataset {dataset_name} not found. Available: {list(DATASET_CONFIGS.keys())}")
        config = DATASET_CONFIGS[name]
        filepath = os.path.join(DATA_DIR, config['filename'])
        df = pd.read_csv(filepath, na_values='?')
        target_col = config['target_col']
    
    # Clean missing values
    df = df.dropna().copy()
    
    # Split features and target
    X = df.drop(columns=[target_col]).copy()
    y_raw = df[target_col]
    
    # Convert features to numeric
    for col in X.columns:
        X[col] = pd.to_numeric(X[col], errors='coerce')
    X = X.dropna().copy()
    y_raw = y_raw.loc[X.index]
    
    # Standardize target to 0 and 1
    if y_raw.dtype == bool:
        y = y_raw.astype(int)
    else:
        y_str = y_raw.astype(str).str.strip().str.lower()
        y = y_str.apply(lambda v: 1 if v in ['true', 't', '1', 'yes', 'defective', 'y'] else 0)
    
    return X, y, df, target_col


def get_dataset_metadata(dataset_name: str, custom_file_path: str = None):
    X, y, df, target_col = load_dataset(dataset_name, custom_file_path)
    total_samples = len(df)
    defective_count = int(y.sum())
    clean_count = total_samples - defective_count
    defect_rate = (defective_count / total_samples) * 100 if total_samples > 0 else 0
    
    features = list(X.columns)
    sample_records = df.head(10).replace({np.nan: None}).to_dict(orient='records')
    
    stats = {}
    for col in features[:15]:  # summary statistics for first 15 features
        stats[col] = {
            'mean': round(float(X[col].mean()), 2),
            'std': round(float(X[col].std()), 2),
            'min': round(float(X[col].min()), 2),
            'max': round(float(X[col].max()), 2)
        }
    
    return {
        'name': dataset_name,
        'target_column': target_col,
        'total_samples': total_samples,
        'features_count': len(features),
        'features': features,
        'defective_count': defective_count,
        'clean_count': clean_count,
        'defect_rate': round(defect_rate, 2),
        'feature_stats': stats,
        'sample_records': sample_records
    }
