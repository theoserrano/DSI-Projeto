import { supabase } from './supabaseConfig';
import type { 
  Review, 
  ReviewWithUser, 
  CreateReviewInput, 
  UpdateReviewInput,
  ReviewStats 
} from '@/types/reviews';

/**
 * Cria uma nova review
 */
export async function createReview(
  userId: string,
  input: CreateReviewInput
): Promise<{ data: Review | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        track_id: input.track_id,
        rating: input.rating,
        comment: input.comment || null,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[Reviews] Erro ao criar review:', error);
    return { data: null, error };
  }
}

/**
 * Busca uma review específica por ID
 */
export async function getReview(
  reviewId: string
): Promise<{ data: ReviewWithUser | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('reviews_with_user')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[Reviews] Erro ao buscar review:', error);
    return { data: null, error };
  }
}

/**
 * Busca todas as reviews de uma música
 */
export async function getReviewsByTrack(
  trackId: string
): Promise<{ data: ReviewWithUser[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('reviews_with_user')
      .select('*')
      .eq('track_id', trackId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[Reviews] Erro ao buscar reviews da música:', error);
    return { data: [], error };
  }
}

/**
 * Busca todas as reviews de um usuário
 */
export async function getReviewsByUser(
  userId: string
): Promise<{ data: ReviewWithUser[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('reviews_with_user')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[Reviews] Erro ao buscar reviews do usuário:', error);
    return { data: [], error };
  }
}

/**
 * Busca todas as reviews (feed global)
 */
export async function getAllReviews(
  limit: number = 50
): Promise<{ data: ReviewWithUser[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('reviews_with_user')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[Reviews] Erro ao buscar todas as reviews:', error);
    return { data: [], error };
  }
}

/**
 * Busca reviews de amigos de um usuário
 */
export async function getFriendsReviews(
  userId: string,
  limit: number = 50
): Promise<{ data: ReviewWithUser[]; error: any }> {
  try {
    // Primeiro, busca os amigos do usuário
    const { data: friendsData, error: friendsError } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId);

    if (friendsError) throw friendsError;

    const friendIds = friendsData?.map((f) => f.friend_id) || [];
    
    if (friendIds.length === 0) {
      return { data: [], error: null };
    }

    // Busca reviews dos amigos
    const { data, error } = await supabase
      .from('reviews_with_user')
      .select('*')
      .in('user_id', friendIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[Reviews] Erro ao buscar reviews de amigos:', error);
    return { data: [], error };
  }
}

/**
 * Atualiza uma review existente
 */
export async function updateReview(
  reviewId: string,
  userId: string,
  input: UpdateReviewInput
): Promise<{ data: Review | null; error: any }> {
  try {
    const updateData: any = {};
    if (input.rating !== undefined) updateData.rating = input.rating;
    if (input.comment !== undefined) updateData.comment = input.comment;

    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', reviewId)
      .eq('user_id', userId) // Garante que só o dono pode atualizar
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[Reviews] Erro ao atualizar review:', error);
    return { data: null, error };
  }
}

/**
 * Deleta uma review
 */
export async function deleteReview(
  reviewId: string,
  userId: string
): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId); // Garante que só o dono pode deletar

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('[Reviews] Erro ao deletar review:', error);
    return { success: false, error };
  }
}

/**
 * Busca estatísticas de reviews de uma música
 */
export async function getTrackReviewStats(
  trackId: string
): Promise<{ data: ReviewStats | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('track_id', trackId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        data: {
          total_reviews: 0,
          average_rating: 0,
          rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
        error: null,
      };
    }

    const totalReviews = data.length;
    const sumRatings = data.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRatings / totalReviews;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach((r) => {
      distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
    });

    return {
      data: {
        total_reviews: totalReviews,
        average_rating: averageRating,
        rating_distribution: distribution,
      },
      error: null,
    };
  } catch (error) {
    console.error('[Reviews] Erro ao buscar estatísticas:', error);
    return { data: null, error };
  }
}

/**
 * Verifica se o usuário já fez review de uma música
 */
export async function getUserReviewForTrack(
  userId: string,
  trackId: string
): Promise<{ data: ReviewWithUser | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('reviews_with_user')
      .select('*')
      .eq('user_id', userId)
      .eq('track_id', trackId)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[Reviews] Erro ao buscar review do usuário:', error);
    return { data: null, error };
  }
}
