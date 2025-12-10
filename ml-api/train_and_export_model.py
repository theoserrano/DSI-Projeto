# ============================================
# Script para Treinar e Exportar Modelo
# ============================================
"""
Este script treina o modelo de classificação de gênero musical
e o salva junto com todos os componentes necessários para fazer
predições em produção.
"""

import pandas as pd
import numpy as np
import joblib
import json
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline

# ============================================
# 1. Configuração de Paths
# ============================================
BASE_DIR = Path(__file__).resolve().parent
# Dataset vem do projeto PISI3 (referência externa)
DATA_DIR = BASE_DIR.parent.parent / 'PISI3-Projeto' / 'DataSet'
MODEL_DIR = BASE_DIR / 'saved_models'
MODEL_DIR.mkdir(exist_ok=True)

# ============================================
# 2. Carregar o dataset
# ============================================
print("📂 Carregando dataset...")
csv_path = DATA_DIR / 'spotify_songs.csv'
df = pd.read_csv(csv_path)
print(f"✓ Dataset carregado: {len(df)} músicas")

# ============================================
# 3. Engenharia de Features
# ============================================
print("\n🔧 Realizando engenharia de features...")
df['release_year'] = pd.to_datetime(df['track_album_release_date'], errors='coerce').dt.year.fillna(0).astype(int)
subgenre_encoder = LabelEncoder()
df['subgenre_encoded'] = subgenre_encoder.fit_transform(df['playlist_subgenre'])

# ============================================
# 4. Preparar features e target
# ============================================
features = [
    'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness',
    'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo',
    'duration_ms', 'track_popularity', 'release_year', 'subgenre_encoded'
]

X = df[features]
y = df['playlist_genre']

# Encoders
genre_encoder = LabelEncoder()
y_encoded = genre_encoder.fit_transform(y)

print(f"✓ Features preparadas: {len(features)}")
print(f"✓ Gêneros disponíveis: {list(genre_encoder.classes_)}")

# ============================================
# 5. Calcular estatísticas das features
# ============================================
print("\n📊 Calculando estatísticas das features...")
feature_stats = {}
for feature in features:
    feature_stats[feature] = {
        'mean': float(df[feature].mean()),
        'std': float(df[feature].std()),
        'min': float(df[feature].min()),
        'max': float(df[feature].max())
    }

# ============================================
# 6. Calcular perfis médios por gênero
# ============================================
print("\n🎵 Calculando perfis médios por gênero...")
genre_profiles = {}
for genre in genre_encoder.classes_:
    genre_data = df[df['playlist_genre'] == genre]
    profile = {}
    for feature in features:
        profile[feature] = float(genre_data[feature].mean())
    genre_profiles[genre] = profile

# ============================================
# 7. Definir modelos para testar
# ============================================
models_to_test = {
    "RandomForest": RandomForestClassifier(
        n_estimators=200, 
        max_depth=30, 
        class_weight='balanced',
        n_jobs=-1, 
        random_state=42
    ),
    "ExtraTrees": ExtraTreesClassifier(
        n_estimators=300, 
        max_depth=30, 
        class_weight='balanced',
        n_jobs=-1, 
        random_state=42
    ),
    "KNN": KNeighborsClassifier(n_neighbors=5, n_jobs=-1),
    "LogisticRegression": LogisticRegression(
        max_iter=1000, 
        class_weight='balanced',
        solver='lbfgs', 
        n_jobs=-1, 
        random_state=42
    )
}

# ============================================
# 8. Dividir dados e treinar modelos
# ============================================
print("\n🎯 Dividindo dados (80% treino, 20% teste)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, stratify=y_encoded, random_state=42
)

print("\n🤖 Treinando e avaliando modelos...")
results = {}
trained_pipelines = {}

for name, model in models_to_test.items():
    print(f"\n   Treinando {name}...")
    
    # Criar pipeline com SMOTE e StandardScaler
    pipeline = Pipeline([
        ('smote', SMOTE(random_state=42)),
        ('scaler', StandardScaler()),
        ('model', model)
    ])
    
    # Treinar
    pipeline.fit(X_train, y_train)
    
    # Avaliar
    train_score = pipeline.score(X_train, y_train)
    test_score = pipeline.score(X_test, y_test)
    
    results[name] = {
        'train_accuracy': train_score,
        'test_accuracy': test_score
    }
    trained_pipelines[name] = pipeline
    
    print(f"   ✓ {name}: Train={train_score:.4f}, Test={test_score:.4f}")

# ============================================
# 9. Selecionar melhor modelo
# ============================================
best_model_name = max(results, key=lambda k: results[k]['test_accuracy'])
best_pipeline = trained_pipelines[best_model_name]
best_accuracy = results[best_model_name]['test_accuracy']

print(f"\n🏆 Melhor modelo: {best_model_name}")
print(f"   Acurácia no teste: {best_accuracy:.4f}")

# ============================================
# 10. Calcular importância das features (se disponível)
# ============================================
feature_importances = {}
try:
    if hasattr(best_pipeline.named_steps['model'], 'feature_importances_'):
        importances = best_pipeline.named_steps['model'].feature_importances_
        for feature, importance in zip(features, importances):
            feature_importances[feature] = float(importance)
        print("\n📈 Feature importances calculadas")
except Exception as e:
    print(f"\n⚠️  Não foi possível calcular feature importances: {e}")
    # Usar importâncias uniformes
    for feature in features:
        feature_importances[feature] = 1.0 / len(features)

# ============================================
# 11. Salvar modelo e componentes
# ============================================
print("\n💾 Salvando modelo e componentes...")

# Salvar pipeline completo
model_path = MODEL_DIR / 'genre_classifier_pipeline.joblib'
joblib.dump(best_pipeline, model_path)
print(f"✓ Pipeline salvo: {model_path}")

# Salvar encoder de gêneros
encoder_path = MODEL_DIR / 'genre_encoder.joblib'
joblib.dump(genre_encoder, encoder_path)
print(f"✓ Encoder salvo: {encoder_path}")

# Salvar encoder de subgêneros
subgenre_encoder_path = MODEL_DIR / 'subgenre_encoder.joblib'
joblib.dump(subgenre_encoder, subgenre_encoder_path)
print(f"✓ Subgenre encoder salvo: {subgenre_encoder_path}")

# Salvar metadados em JSON
metadata = {
    'model_info': {
        'type': best_model_name,
        'version': '2.0',
        'description': 'Classificador de gênero musical treinado com PISI3-Projeto',
        'train_accuracy': float(results[best_model_name]['train_accuracy']),
        'test_accuracy': float(results[best_model_name]['test_accuracy']),
        'training_date': pd.Timestamp.now().isoformat(),
        'n_samples_train': len(X_train),
        'n_samples_test': len(X_test)
    },
    'features': {
        'list': features,
        'importances': feature_importances,
        'stats': feature_stats
    },
    'genres': {
        'classes': list(genre_encoder.classes_),
        'n_classes': len(genre_encoder.classes_),
        'profiles': genre_profiles
    },
    'subgenres': {
        'classes': list(subgenre_encoder.classes_)
    }
}

metadata_path = MODEL_DIR / 'model_metadata.json'
with open(metadata_path, 'w', encoding='utf-8') as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)
print(f"✓ Metadata salvo: {metadata_path}")

# ============================================
# 12. Sumário Final
# ============================================
print("\n" + "="*50)
print("✅ MODELO TREINADO E EXPORTADO COM SUCESSO!")
print("="*50)
print(f"\n📦 Arquivos salvos em: {MODEL_DIR}")
print(f"   • {model_path.name}")
print(f"   • {encoder_path.name}")
print(f"   • {subgenre_encoder_path.name}")
print(f"   • {metadata_path.name}")
print(f"\n🎯 Modelo: {best_model_name}")
print(f"🎵 Gêneros: {', '.join(genre_encoder.classes_)}")
print(f"📊 Acurácia: {best_accuracy:.2%}")
print("\n" + "="*50)
