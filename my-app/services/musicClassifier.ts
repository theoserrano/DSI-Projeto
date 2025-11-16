/**
 * Serviço de Classificação Musical
 * 
 * Implementa um classificador simplificado de gênero musical
 * baseado em similaridade de perfis de features.
 */

import modelData from '@/assets/data/music_classifier_model.json';
import { normalizeValue } from '@/utils/featureMapping';

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

/**
 * Classifica o perfil musical do usuário
 */
export function classifyMusicProfile(
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
