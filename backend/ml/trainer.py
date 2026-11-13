"""
Model trainer executing 5-fold cross validation with G-Mean scorer matching MLSD.ipynb.
Also fits and caches the pipeline for on-demand predictions.
"""
import time
import numpy as np
from sklearn.model_selection import cross_validate, train_test_split
from sklearn.metrics import make_scorer, confusion_matrix, accuracy_score, f1_score
from imblearn.metrics import geometric_mean_score

from .models import build_pipeline
from .preprocessor import load_dataset

# In-memory storage for active trained pipelines
TRAINED_PIPELINES = {}


def train_model(dataset_name: str, classifier_name: str, normalization_name: str, custom_file_path: str = None):
    X, y, df, target_col = load_dataset(dataset_name, custom_file_path)
    pipe = build_pipeline(normalization_name, classifier_name)
    
    # 5-fold cross validation scorer matching notebook
    gm_scorer = make_scorer(geometric_mean_score, greater_is_better=True, average='binary')
    scorers = {
        'accuracy': 'accuracy',
        'f1': 'f1',
        'g_mean': gm_scorer
    }
    
    start_time = time.time()
    cv_scores = cross_validate(pipe, X, y, cv=5, scoring=scorers, return_train_score=False)
    cv_duration = time.time() - start_time
    
    # 80-20 train-test split for confusion matrix and final pipeline fit
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    fit_start = time.time()
    pipe.fit(X_train, y_train)
    single_fit_time = time.time() - fit_start
    
    y_pred = pipe.predict(X_test)
    test_acc = float(accuracy_score(y_test, y_pred))
    test_f1 = float(f1_score(y_test, y_pred, average='binary', zero_division=0))
    test_gmean = float(geometric_mean_score(y_test, y_pred, average='binary'))
    
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = int(cm[0, 0]), int(cm[0, 1]), int(cm[1, 0]), int(cm[1, 1])
    
    # Cache pipeline key
    cache_key = f"{dataset_name}_{classifier_name}_{normalization_name}".lower()
    TRAINED_PIPELINES[cache_key] = {
        'pipeline': pipe,
        'features': list(X.columns),
        'dataset_name': dataset_name
    }
    
    fold_scores = []
    for i in range(len(cv_scores['test_accuracy'])):
        fold_scores.append({
            'fold': i + 1,
            'accuracy': round(float(cv_scores['test_accuracy'][i]), 4),
            'f1': round(float(cv_scores['test_f1'][i]), 4),
            'g_mean': round(float(cv_scores['test_g_mean'][i]), 4),
            'fit_time': round(float(cv_scores['fit_time'][i]), 4)
        })
    
    return {
        'dataset': dataset_name,
        'classifier': classifier_name,
        'normalization': normalization_name,
        'cv_folds': 5,
        'mean_accuracy': round(float(cv_scores['test_accuracy'].mean()), 4),
        'std_accuracy': round(float(cv_scores['test_accuracy'].std()), 4),
        'mean_f1': round(float(cv_scores['test_f1'].mean()), 4),
        'std_f1': round(float(cv_scores['test_f1'].std()), 4),
        'mean_g_mean': round(float(cv_scores['test_g_mean'].mean()), 4),
        'std_g_mean': round(float(cv_scores['test_g_mean'].std()), 4),
        'mean_fit_time': round(float(np.mean(cv_scores['fit_time'])), 4),
        'std_fit_time': round(float(np.std(cv_scores['fit_time'])), 4),
        'test_accuracy': round(test_acc, 4),
        'test_f1': round(test_f1, 4),
        'test_g_mean': round(test_gmean, 4),
        'confusion_matrix': {
            'true_negative': tn,
            'false_positive': fp,
            'false_negative': fn,
            'true_positive': tp
        },
        'fold_scores': fold_scores,
        'total_training_duration': round(cv_duration, 3)
    }
