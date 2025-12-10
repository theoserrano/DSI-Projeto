# ============================================
# API FastAPI para Classificação de Gênero Musical
# ============================================
"""
API REST para servir predições do modelo de classificação
de gênero musical treinado.

Uso:
    python api_model_server.py

A API estará disponível em: http://localhost:8000
Documentação: http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import joblib
import numpy as np
import json
from pathlib import Path
import uvicorn

# ============================================
# Configuração
# ============================================
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / 'saved_models'

app = FastAPI(
    title="Music Genre Classifier API",
    description="API para classificação de gênero musical usando ML",
    version="2.0.0"
)

# CORS - permitir requisições do React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Carregar Modelo e Componentes
# ============================================
print("🚀 Iniciando servidor da API...")
print(f"📂 Diretório de modelos: {MODEL_DIR}")

try:
    # Carregar pipeline
    model_path = MODEL_DIR / 'genre_classifier_pipeline.joblib'
    pipeline = joblib.load(model_path)
    print(f"✓ Pipeline carregado: {model_path.name}")
    
    # Carregar encoder
    encoder_path = MODEL_DIR / 'genre_encoder.joblib'
    genre_encoder = joblib.load(encoder_path)
    print(f"✓ Encoder carregado: {encoder_path.name}")
    
    # Carregar metadata
    metadata_path = MODEL_DIR / 'model_metadata.json'
    with open(metadata_path, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    print(f"✓ Metadata carregado: {metadata_path.name}")
    
    print("\n✅ Modelo carregado com sucesso!")
    print(f"🎯 Tipo: {metadata['model_info']['type']}")
    print(f"📊 Acurácia: {metadata['model_info']['test_accuracy']:.2%}")
    print(f"🎵 Gêneros: {', '.join(metadata['genres']['classes'])}")
    
except Exception as e:
    print(f"\n❌ ERRO ao carregar modelo: {e}")
    print("\n⚠️  Execute primeiro: python train_and_export_model.py")
    raise

# ============================================
# Modelos de Dados (Pydantic)
# ============================================
class MusicFeatures(BaseModel):
    """Features de uma música para classificação"""
    danceability: float = Field(..., ge=0, le=1, description="Dançabilidade (0-1)")
    energy: float = Field(..., ge=0, le=1, description="Energia (0-1)")
    key: int = Field(..., ge=0, le=11, description="Tonalidade (0-11)")
    loudness: float = Field(..., description="Volume em dB")
    mode: int = Field(..., ge=0, le=1, description="Modo (0=menor, 1=maior)")
    speechiness: float = Field(..., ge=0, le=1, description="Presença de fala (0-1)")
    acousticness: float = Field(..., ge=0, le=1, description="Acústico (0-1)")
    instrumentalness: float = Field(..., ge=0, le=1, description="Instrumental (0-1)")
    liveness: float = Field(..., ge=0, le=1, description="Ao vivo (0-1)")
    valence: float = Field(..., ge=0, le=1, description="Positividade (0-1)")
    tempo: float = Field(..., gt=0, description="BPM")
    duration_ms: float = Field(..., gt=0, description="Duração em ms")
    track_popularity: float = Field(0, ge=0, le=100, description="Popularidade (0-100)")
    release_year: int = Field(2000, ge=1900, le=2100, description="Ano de lançamento")
    subgenre_encoded: int = Field(0, ge=0, description="Subgênero codificado")
    
    class Config:
        schema_extra = {
            "example": {
                "danceability": 0.65,
                "energy": 0.70,
                "key": 5,
                "loudness": -5.0,
                "mode": 1,
                "speechiness": 0.08,
                "acousticness": 0.25,
                "instrumentalness": 0.05,
                "liveness": 0.15,
                "valence": 0.60,
                "tempo": 120.0,
                "duration_ms": 210000,
                "track_popularity": 75,
                "release_year": 2023,
                "subgenre_encoded": 0
            }
        }


class GenreScore(BaseModel):
    """Score de um gênero"""
    genre: str
    probability: float
    confidence: float


class ClassificationResult(BaseModel):
    """Resultado da classificação"""
    primary_genre: str
    confidence: float
    all_scores: List[GenreScore]


class UserProfile(BaseModel):
    """Perfil musical agregado do usuário (médias das features)"""
    danceability: float
    energy: float
    valence: float
    tempo: float
    acousticness: float
    instrumentalness: float
    speechiness: float
    loudness: float
    # Features opcionais
    key: Optional[float] = 5
    mode: Optional[float] = 1
    liveness: Optional[float] = 0.15
    duration_ms: Optional[float] = 210000
    track_popularity: Optional[float] = 50
    release_year: Optional[int] = 2020
    subgenre_encoded: Optional[int] = 0


# ============================================
# Endpoints
# ============================================
@app.get("/")
async def root():
    """Informações básicas da API"""
    return {
        "message": "Music Genre Classifier API",
        "version": "2.0.0",
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "info": "/info",
            "classify": "/classify",
            "classify_profile": "/classify_profile"
        }
    }


@app.get("/info")
async def get_model_info():
    """Retorna informações sobre o modelo"""
    return {
        "model": metadata['model_info'],
        "features": {
            "count": len(metadata['features']['list']),
            "list": metadata['features']['list']
        },
        "genres": metadata['genres']['classes'],
        "n_genres": metadata['genres']['n_classes']
    }


@app.get("/genres")
async def get_genres():
    """Retorna a lista de gêneros disponíveis"""
    return {
        "genres": metadata['genres']['classes'],
        "profiles": metadata['genres']['profiles']
    }


@app.post("/classify", response_model=ClassificationResult)
async def classify_track(features: MusicFeatures):
    """
    Classifica uma música individual com base em suas features.
    
    Retorna o gênero previsto com probabilidades para todos os gêneros.
    """
    try:
        # Converter para array na ordem correta das features
        feature_order = metadata['features']['list']
        feature_dict = features.dict()
        
        X = np.array([[feature_dict[f] for f in feature_order]])
        
        # Fazer predição
        y_pred = pipeline.predict(X)[0]
        y_proba = pipeline.predict_proba(X)[0]
        
        # Decodificar gênero
        primary_genre = genre_encoder.inverse_transform([y_pred])[0]
        confidence = float(y_proba[y_pred])
        
        # Criar scores para todos os gêneros
        all_scores = []
        for idx, genre in enumerate(genre_encoder.classes_):
            all_scores.append(GenreScore(
                genre=genre,
                probability=float(y_proba[idx]),
                confidence=float(y_proba[idx]) * 100
            ))
        
        # Ordenar por probabilidade
        all_scores.sort(key=lambda x: x.probability, reverse=True)
        
        return ClassificationResult(
            primary_genre=primary_genre,
            confidence=confidence,
            all_scores=all_scores
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na classificação: {str(e)}")


@app.post("/classify_profile", response_model=ClassificationResult)
async def classify_user_profile(profile: UserProfile):
    """
    Classifica o perfil musical de um usuário com base nas médias de suas features.
    
    Este endpoint recebe features agregadas (médias) das músicas que o usuário gosta
    e retorna os gêneros que melhor correspondem ao seu gosto musical.
    """
    try:
        # Converter para features completas
        feature_dict = profile.dict()
        feature_order = metadata['features']['list']
        
        # Garantir que todas as features estão presentes
        X = np.array([[feature_dict.get(f, 0) for f in feature_order]])
        
        # Fazer predição
        y_pred = pipeline.predict(X)[0]
        y_proba = pipeline.predict_proba(X)[0]
        
        # Decodificar gênero
        primary_genre = genre_encoder.inverse_transform([y_pred])[0]
        confidence = float(y_proba[y_pred])
        
        # Criar scores para todos os gêneros
        all_scores = []
        for idx, genre in enumerate(genre_encoder.classes_):
            all_scores.append(GenreScore(
                genre=genre,
                probability=float(y_proba[idx]),
                confidence=float(y_proba[idx]) * 100
            ))
        
        # Ordenar por probabilidade
        all_scores.sort(key=lambda x: x.probability, reverse=True)
        
        return ClassificationResult(
            primary_genre=primary_genre,
            confidence=confidence,
            all_scores=all_scores
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na classificação do perfil: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": pipeline is not None,
        "encoder_loaded": genre_encoder is not None
    }


# ============================================
# Main
# ============================================
if __name__ == "__main__":
    print("\n" + "="*50)
    print("🎵 MUSIC GENRE CLASSIFIER API")
    print("="*50)
    print(f"\n🌐 Servidor: http://localhost:8000")
    print(f"📚 Docs: http://localhost:8000/docs")
    print(f"🔄 Redoc: http://localhost:8000/redoc")
    print("\n" + "="*50 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
