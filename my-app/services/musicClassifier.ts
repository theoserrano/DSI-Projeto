/**
 * Serviço de Classificação Musical
 * 
 * Integração com o modelo de ML treinado do PISI3-Projeto.
 * Suporta classificação via API (produção) e fallback local (desenvolvimento).
 */

import modelData from '@/assets/data/music_classifier_model.json';
import { normalizeValue } from '@/utils/featureMapping';

// ============================================
// Configuração da API
// ============================================
const API_BASE_URL = process.env.EXPO_PUBLIC_ML_API_URL || 'http://localhost:8000';
const USE_API = process.env.EXPO_PUBLIC_USE_ML_API === 'true';
const API_TIMEOUT = 5000; // 5 segundos

// ============================================
// Interfaces
// ============================================
export interface ClassificationResult {
  primaryGenre: string;
  confidence: number;
  allScores: GenreScore[];
}

export interface GenreScore {
  genre: string;
  genreName: string;
  score: number;
  color: string;
  icon: string;
}

export interface GenreInfo {
  id: number;
  name: string;
  color: string;
  icon: string;
  profile: Record<string, number>;
}

interface APIGenreScore {
  genre: string;
  probability: number;
  confidence: number;
}

interface APIClassificationResult {
  primary_genre: string;
  confidence: number;
  all_scores: APIGenreScore[];
}

/**
 * Calcula a distância euclidiana entre dois vetores de features
 */
function euclideanDistance(
  features1: Record<string, number>,
  features2: Record<string, number>
): number {
  let sum = 0;
  const commonFeatures = Object.keys(features1).filter(f => f in features2);
  
  for (const feature of commonFeatures) {
    const diff = features1[feature] - features2[feature];
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
}

/**
 * Normaliza features usando os stats do modelo
 */
function normalizeFeatures(features: Record<string, number>): Record<string, number> {
  const normalized: Record<string, number> = {};
  
  for (const [feature, value] of Object.entries(features)) {
    normalized[feature] = normalizeValue(feature, value);
  }
  
  return normalized;
}

// ============================================
// Mapeamento de Gêneros para UI
// ============================================
const GENRE_UI_MAP: Record<string, { name: string; color: string; icon: string }> = {
  'pop': { name: 'POP', color: '#FF1493', icon: '🎤' },
  'rap': { name: 'RAP', color: '#9370DB', icon: '🎙️' },
  'rock': { name: 'ROCK', color: '#E74C3C', icon: '🎸' },
  'latin': { name: 'LATIN', color: '#F39C12', icon: '💃' },
  'r&b': { name: 'R&B', color: '#8E44AD', icon: '🎶' },
  'edm': { name: 'EDM', color: '#3498DB', icon: '🎧' },
};

/**
 * Classifica o perfil musical do usuário usando a API de ML
 */
async function classifyMusicProfileAPI(
  userFeatures: Record<string, number>
): Promise<ClassificationResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}/classify_profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        danceability: userFeatures.danceability || 0.5,
        energy: userFeatures.energy || 0.5,
        valence: userFeatures.valence || 0.5,
        tempo: userFeatures.tempo || 120,
        acousticness: userFeatures.acousticness || 0.5,
        instrumentalness: userFeatures.instrumentalness || 0.5,
        speechiness: userFeatures.speechiness || 0.5,
        loudness: userFeatures.loudness || -5,
        key: userFeatures.key || 5,
        mode: userFeatures.mode || 1,
        liveness: userFeatures.liveness || 0.15,
        duration_ms: userFeatures.duration_ms || 210000,
        track_popularity: userFeatures.track_popularity || 50,
        release_year: userFeatures.release_year || 2020,
        subgenre_encoded: userFeatures.subgenre_encoded || 0,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: APIClassificationResult = await response.json();

    // Converter resposta da API para formato do app
    const allScores: GenreScore[] = data.all_scores.map(score => {
      const uiInfo = GENRE_UI_MAP[score.genre.toLowerCase()] || {
        name: score.genre.toUpperCase(),
        color: '#95A5A6',
        icon: '🎵',
      };

      return {
        genre: score.genre.toLowerCase(),
        genreName: uiInfo.name,
        score: Math.round(score.confidence * 10) / 10,
        color: uiInfo.color,
        icon: uiInfo.icon,
      };
    });

    return {
      primaryGenre: data.primary_genre.toLowerCase(),
      confidence: Math.round(data.confidence * 1000) / 10,
      allScores,
    };
  } catch (error) {
    console.warn('Erro ao classificar via API:', error);
    return null;
  }
}

/**
 * Classifica o perfil musical do usuário (fallback local)
 */
function classifyMusicProfileLocal(
  userFeatures: Record<string, number>
): ClassificationResult {
  // Normalizar features do usuário
  const normalizedUser = normalizeFeatures(userFeatures);
  
  // Calcular distância para cada gênero
  const genres = modelData.genres;
  const scores: GenreScore[] = [];
  
  for (const [genreKey, genreInfo] of Object.entries(genres)) {
    const normalizedProfile = normalizeFeatures(genreInfo.profile);
    const distance = euclideanDistance(normalizedUser, normalizedProfile);
    
    // Converter distância em score (menor distância = maior score)
    // Usando uma função exponencial para amplificar diferenças
    const maxDistance = Math.sqrt(Object.keys(normalizedUser).length);
    const score = Math.exp(-distance / maxDistance) * 100;
    
    scores.push({
      genre: genreKey,
      genreName: genreInfo.name,
      score: Math.round(score * 10) / 10,
      color: genreInfo.color,
      icon: genreInfo.icon,
    });
  }
  
  // Ordenar por score descendente
  scores.sort((a, b) => b.score - a.score);
  
  // Normalizar scores para que somem 100%
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const normalizedScores = scores.map(s => ({
    ...s,
    score: Math.round((s.score / totalScore) * 1000) / 10,
  }));
  
  return {
    primaryGenre: normalizedScores[0].genre,
    confidence: normalizedScores[0].score,
    allScores: normalizedScores,
  };
}

/**
 * Classifica o perfil musical do usuário
 * Usa API se disponível, caso contrário usa classificação local
 */
export async function classifyMusicProfile(
  userFeatures: Record<string, number>
): Promise<ClassificationResult> {
  // Tentar usar API se configurada
  if (USE_API) {
    const apiResult = await classifyMusicProfileAPI(userFeatures);
    if (apiResult) {
      console.log('✓ Classificação via API (modelo PISI3)');
      return apiResult;
    }
    console.warn('⚠️ API indisponível, usando classificação local');
  }
  
  // Fallback para classificação local
  return classifyMusicProfileLocal(userFeatures);
}

/**
 * Obtém informações sobre um gênero específico
 */
export function getGenreInfo(genre: string): GenreInfo | null {
  const info = modelData.genres[genre as keyof typeof modelData.genres];
  if (!info) return null;
  
  return info as GenreInfo;
}

/**
 * Obtém todos os gêneros disponíveis
 */
export function getAllGenres(): string[] {
  return Object.keys(modelData.genres);
}

/**
 * Valida se todas as features necessárias foram fornecidas
 */
export function validateFeatures(features: Record<string, number>): {
  isValid: boolean;
  missingFeatures: string[];
} {
  const topFeatures = modelData.features.top;
  const missingFeatures = topFeatures.filter(f => !(f in features));
  
  return {
    isValid: missingFeatures.length === 0,
    missingFeatures,
  };
}
