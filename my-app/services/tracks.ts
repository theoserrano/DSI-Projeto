import { supabase } from './supabaseConfig';
import { getTrackReviewStats } from './reviews';
import type { Track, TrackWithStats } from '@/types/tracks';

// Função auxiliar para gerar cover da música (usando um serviço de placeholder)
function generateCoverUrl(trackId: string, albumName: string): string {
  const seed = albumName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['3498db', 'e74c3c', '2ecc71', 'f39c12', '9b59b6', '1abc9c'];
  const color = colors[seed % colors.length];
  
  return `https://via.placeholder.com/300/${color}/ffffff?text=${encodeURIComponent(albumName.substring(0, 2))}`;
}

/**
 * Busca uma música por ID do Supabase
 */
export async function getTrackById(trackId: string): Promise<TrackWithStats | null> {
  try {
    const { data: track, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('track_id', trackId)
      .single();
    
    if (error || !track) {
      console.error('[Tracks] Erro ao buscar música:', error);
      return null;
    }

    // Busca estatísticas de reviews
    const { data: stats } = await getTrackReviewStats(trackId);

    const trackWithStats: TrackWithStats = {
      track_id: track.track_id,
      track_name: track.track_name,
      track_artist: track.track_artist,
      track_album_name: track.track_album_name,
      track_album_release_date: track.track_album_release_date,
      track_popularity: track.track_popularity,
      playlist_name: track.playlist_name,
      playlist_id: track.playlist_id,
      playlist_genre: track.playlist_genre,
      playlist_subgenre: track.playlist_subgenre,
      danceability: track.danceability,
      energy: track.energy,
      key: track.key,
      loudness: track.loudness,
      mode: track.mode,
      speechiness: track.speechiness,
      acousticness: track.acousticness,
      instrumentalness: track.instrumentalness,
      liveness: track.liveness,
      valence: track.valence,
      tempo: track.tempo,
      duration_ms: track.duration_ms,
      average_rating: stats?.average_rating || 0,
      total_reviews: stats?.total_reviews || 0,
      cover: generateCoverUrl(track.track_id, track.track_album_name),
    };

    return trackWithStats;
  } catch (error) {
    console.error('[Tracks] Erro ao buscar música:', error);
    return null;
  }
}

/**
 * Busca músicas por nome (busca parcial)
 */
export async function searchTracks(query: string, limit: number = 20): Promise<TrackWithStats[]> {
  try {
    const lowerQuery = query.toLowerCase();
    
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .or(`track_name.ilike.%${lowerQuery}%,track_artist.ilike.%${lowerQuery}%,track_album_name.ilike.%${lowerQuery}%`)
      .limit(limit);

    if (error) {
      console.error('[Tracks] Erro ao buscar músicas:', error);
      return [];
    }

    return (data || []).map((song: any) => ({
      ...song,
      cover: generateCoverUrl(song.track_id, song.track_album_name),
    }));
  } catch (error) {
    console.error('[Tracks] Erro ao buscar músicas:', error);
    return [];
  }
}

/**
 * Busca músicas por artista
 */
export async function getTracksByArtist(artist: string, limit: number = 20): Promise<TrackWithStats[]> {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .ilike('track_artist', `%${artist}%`)
      .limit(limit);

    if (error) {
      console.error('[Tracks] Erro ao buscar músicas por artista:', error);
      return [];
    }

    return (data || []).map((song: any) => ({
      ...song,
      cover: generateCoverUrl(song.track_id, song.track_album_name),
    }));
  } catch (error) {
    console.error('[Tracks] Erro ao buscar músicas por artista:', error);
    return [];
  }
}

/**
 * Busca músicas por gênero
 */
export async function getTracksByGenre(genre: string, limit: number = 20): Promise<TrackWithStats[]> {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .or(`playlist_genre.ilike.%${genre}%,playlist_subgenre.ilike.%${genre}%`)
      .limit(limit);

    if (error) {
      console.error('[Tracks] Erro ao buscar músicas por gênero:', error);
      return [];
    }

    return (data || []).map((song: any) => ({
      ...song,
      cover: generateCoverUrl(song.track_id, song.track_album_name),
    }));
  } catch (error) {
    console.error('[Tracks] Erro ao buscar músicas por gênero:', error);
    return [];
  }
}

/**
 * Busca músicas populares
 */
export async function getPopularTracks(limit: number = 20): Promise<TrackWithStats[]> {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('track_popularity', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Tracks] Erro ao buscar músicas populares:', error);
      return [];
    }

    return (data || []).map((song: any) => ({
      ...song,
      cover: generateCoverUrl(song.track_id, song.track_album_name),
    }));
  } catch (error) {
    console.error('[Tracks] Erro ao buscar músicas populares:', error);
    return [];
  }
}

/**
 * Busca músicas aleatórias
 */
export async function getRandomTracks(limit: number = 20): Promise<TrackWithStats[]> {
  try {
    // Supabase não tem ORDER BY RANDOM() direto, então pegamos mais e embaralhamos
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .limit(limit * 2);

    if (error) {
      console.error('[Tracks] Erro ao buscar músicas aleatórias:', error);
      return [];
    }

    const shuffled = (data || []).sort(() => 0.5 - Math.random()).slice(0, limit);
    
    return shuffled.map((song: any) => ({
      ...song,
      cover: generateCoverUrl(song.track_id, song.track_album_name),
    }));
  } catch (error) {
    console.error('[Tracks] Erro ao buscar músicas aleatórias:', error);
    return [];
  }
}

/**
 * Busca todas as músicas (com paginação)
 */
export async function getAllTracks(offset: number = 0, limit: number = 50): Promise<TrackWithStats[]> {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[Tracks] Erro ao buscar todas as músicas:', error);
      return [];
    }

    return (data || []).map((song: any) => ({
      ...song,
      cover: generateCoverUrl(song.track_id, song.track_album_name),
    }));
  } catch (error) {
    console.error('[Tracks] Erro ao buscar todas as músicas:', error);
    return [];
  }
}
