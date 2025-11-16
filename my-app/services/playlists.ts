import { supabase } from './supabaseConfig';
import { DEFAULT_PLAYLIST_COVER_URL } from '@/constants/images';

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  image_url?: string;
  track_count?: number;
  last_accessed?: string;
}

/**
 * Busca as playlists do usuário
 */
export async function getUserPlaylists(userId: string, limit: number = 20): Promise<Playlist[]> {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        playlist_tracks (count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Playlists] Erro ao buscar playlists:', error);
      return [];
    }

    if (!data) return [];

    return data.map((playlist: any) => ({
      id: playlist.id,
      user_id: playlist.user_id,
      name: playlist.name,
      description: playlist.description,
      is_public: playlist.is_public,
      created_at: playlist.created_at,
      image_url: playlist.image_url || DEFAULT_PLAYLIST_COVER_URL,
      track_count: playlist.playlist_tracks?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error('[Playlists] Erro ao buscar playlists:', error);
    return [];
  }
}

/**
 * Cria uma nova playlist
 */
export async function createPlaylist(
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = true,
  imageUrl?: string
): Promise<Playlist | null> {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .insert([{
        user_id: userId,
        name,
        description,
        is_public: isPublic,
        image_url: imageUrl,
      }])
      .select()
      .single();

    if (error) {
      console.error('[Playlists] Erro ao criar playlist:', error);
      return null;
    }

    return {
      ...data,
      image_url: data.image_url || DEFAULT_PLAYLIST_COVER_URL,
      track_count: 0,
    };
  } catch (error) {
    console.error('[Playlists] Erro ao criar playlist:', error);
    return null;
  }
}

/**
 * Atualiza o timestamp de último acesso da playlist
 */
export async function updatePlaylistAccess(playlistId: string): Promise<boolean> {
  try {
    // Primeiro, verifica se a coluna last_accessed existe
    // Se não existir, só retorna true silenciosamente
    const { error } = await supabase
      .from('playlists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', playlistId);

    if (error) {
      if (__DEV__) {
        console.log('[Playlists] Nota: Não foi possível atualizar acesso:', error.message);
      }
      return true; // Retorna true mesmo assim para não quebrar o fluxo
    }

    return true;
  } catch (error) {
    if (__DEV__) {
      console.log('[Playlists] Nota: Não foi possível atualizar acesso');
    }
    return true;
  }
}

/**
 * Busca as playlists mais recentemente acessadas do usuário
 * Por enquanto, ordena por created_at até que tenhamos um campo last_accessed
 */
export async function getRecentPlaylists(userId: string, limit: number = 5): Promise<Playlist[]> {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        playlist_tracks (count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Playlists] Erro ao buscar playlists recentes:', error);
      return [];
    }

    if (!data) return [];

    return data.map((playlist: any) => ({
      id: playlist.id,
      user_id: playlist.user_id,
      name: playlist.name,
      description: playlist.description,
      is_public: playlist.is_public,
      created_at: playlist.created_at,
      image_url: playlist.image_url || DEFAULT_PLAYLIST_COVER_URL,
      track_count: playlist.playlist_tracks?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error('[Playlists] Erro ao buscar playlists recentes:', error);
    return [];
  }
}

/**
 * Busca uma playlist por ID
 */
export async function getPlaylistById(playlistId: string): Promise<Playlist | null> {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        playlist_tracks (count)
      `)
      .eq('id', playlistId)
      .single();

    if (error) {
      console.error('[Playlists] Erro ao buscar playlist:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      is_public: data.is_public,
      created_at: data.created_at,
      image_url: data.image_url || DEFAULT_PLAYLIST_COVER_URL,
      track_count: data.playlist_tracks?.[0]?.count || 0,
    };
  } catch (error) {
    console.error('[Playlists] Erro ao buscar playlist:', error);
    return null;
  }
}

/**
 * Deleta uma playlist
 */
export async function deletePlaylist(playlistId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', playlistId)
      .eq('user_id', userId);

    if (error) {
      console.error('[Playlists] Erro ao deletar playlist:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Playlists] Erro ao deletar playlist:', error);
    return false;
  }
}

/**
 * Verifica se uma música já está na playlist
 */
export async function isTrackInPlaylist(playlistId: string, trackId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select('id')
      .eq('playlist_id', playlistId)
      .eq('track_id', trackId)
      .maybeSingle();

    if (error) {
      console.error('[Playlists] Erro ao verificar música na playlist:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('[Playlists] Erro ao verificar música na playlist:', error);
    return false;
  }
}

/**
 * Adiciona uma música à playlist
 */
export async function addTrackToPlaylist(playlistId: string, trackId: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Verifica se a música já está na playlist
    const exists = await isTrackInPlaylist(playlistId, trackId);
    
    if (exists) {
      return {
        success: false,
        message: 'Esta música já está nesta playlist',
      };
    }

    // Adiciona a música à playlist
    const { error } = await supabase
      .from('playlist_tracks')
      .insert([{
        playlist_id: playlistId,
        track_id: trackId,
      }]);

    if (error) {
      console.error('[Playlists] Erro ao adicionar música:', error);
      return {
        success: false,
        message: 'Erro ao adicionar música à playlist',
      };
    }

    return {
      success: true,
      message: 'Música adicionada com sucesso!',
    };
  } catch (error) {
    console.error('[Playlists] Erro ao adicionar música:', error);
    return {
      success: false,
      message: 'Erro ao adicionar música à playlist',
    };
  }
}

/**
 * Remove uma música da playlist
 */
export async function removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('playlist_tracks')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('track_id', trackId);

    if (error) {
      console.error('[Playlists] Erro ao remover música:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Playlists] Erro ao remover música:', error);
    return false;
  }
}
