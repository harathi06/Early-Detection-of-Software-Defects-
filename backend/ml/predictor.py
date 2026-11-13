"""
Prediction inference module supporting all 7 classifiers with probability confidence.
"""
import numpy as np
import pandas as pd
from .trainer import TRAINED_PIPELINES, train_model
from .preprocessor import load_dataset


def predict_defect(dataset_name: str, classifier_name: str, normalization_name: str, feature_dict: dict):
    cache_key = f"{dataset_name}_{classifier_name}_{normalization_name}".lower()
    
    if cache_key not in TRAINED_PIPELINES:
        # Fit model on demand
        train_model(dataset_name, classifier_name, normalization_name)
    
    cached = TRAINED_PIPELINES[cache_key]
    pipe = cached['pipeline']
    expected_features = cached['features']
    
    # Align features
    row = []
    missing_features = []
    for f in expected_features:
        if f in feature_dict:
            try:
                row.append(float(feature_dict[f]))
            except (ValueError, TypeError):
                row.append(0.0)
        else:
            missing_features.append(f)
            row.append(0.0)
    
    X_input = pd.DataFrame([row], columns=expected_features)
    
    pred = int(pipe.predict(X_input)[0])
    is_defective = bool(pred == 1)
    
    # Determine confidence / defect probability
    clf = pipe.named_steps['clf']
    defect_prob = None
    confidence = None
    
    if hasattr(pipe, 'predict_proba'):
        try:
            probs = pipe.predict_proba(X_input)[0]
            defect_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
            confidence = float(np.max(probs))
        except Exception:
            pass
    
    if defect_prob is None and hasattr(clf, 'decision_function'):
        try:
            # Map decision function through logistic sigmoid
            df_val = float(pipe.decision_function(X_input)[0])
            sigmoid_prob = 1.0 / (1.0 + np.exp(-df_val))
            defect_prob = sigmoid_prob
            confidence = max(sigmoid_prob, 1.0 - sigmoid_prob)
        except Exception:
            pass
            
    if defect_prob is None:
        defect_prob = 1.0 if is_defective else 0.0
        confidence = 0.85
    
    # Risk categorization
    if defect_prob >= 0.7:
        risk_level = "High"
    elif defect_prob >= 0.4:
        risk_level = "Medium"
    else:
        risk_level = "Low"
    
    return {
        'is_defective': is_defective,
        'label': 'Defective' if is_defective else 'Clean / Non-Defective',
        'defect_probability': round(float(defect_prob), 4),
        'confidence': round(float(confidence), 4),
        'risk_level': risk_level,
        'classifier': classifier_name,
        'normalization': normalization_name,
        'dataset': dataset_name,
        'missing_features_imputed': missing_features
    }
