"""
ML Model definitions matching the original MLSD.ipynb notebook.
Classifiers:
- Logistic Regression
- Perceptron
- Linear SVM
- RBF SVM
- Decision Tree
- Random Forest
- Feed-Forward Neural Network (MLPClassifier)
"""
from sklearn.linear_model import LogisticRegression, Perceptron
from sklearn.svm import LinearSVC, SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.pipeline import Pipeline


def get_classifiers():
    return {
        'LogisticRegression': LogisticRegression(max_iter=1000, random_state=42),
        'Perceptron': Perceptron(max_iter=100, random_state=42),
        'LinearSVM': LinearSVC(C=1, max_iter=500, dual=False, random_state=42),
        'RBFSVM': SVC(kernel='rbf', gamma='scale', C=1, max_iter=50000, probability=True, random_state=42),
        'DecisionTree': DecisionTreeClassifier(random_state=42),
        'RandomForest': RandomForestClassifier(n_estimators=100, random_state=42),
        'NeuralNetwork': MLPClassifier(hidden_layer_sizes=(100,), max_iter=1000, random_state=42)
    }


def get_scalers():
    return {
        'None': None,
        'MinMax': MinMaxScaler(),
        'Standard': StandardScaler()
    }


def build_pipeline(scaler_name: str, classifier_name: str):
    scalers = get_scalers()
    classifiers = get_classifiers()
    
    if scaler_name not in scalers:
        raise ValueError(f"Unknown scaler: {scaler_name}. Available: {list(scalers.keys())}")
    if classifier_name not in classifiers:
        raise ValueError(f"Unknown classifier: {classifier_name}. Available: {list(classifiers.keys())}")
    
    scaler = scalers[scaler_name]
    clf = classifiers[classifier_name]
    
    steps = []
    if scaler is not None:
        steps.append(('scaler', scaler))
    steps.append(('clf', clf))
    
    return Pipeline(steps)
