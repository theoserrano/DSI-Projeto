import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as reviewsService from '@/services/reviews';
import type { ReviewWithUser, CreateReviewInput, UpdateReviewInput } from '@/types/reviews';
import { logAction, logDataLoad, logError, logWarning } from '@/utils/logger';

interface ReviewsContextData {
  reviews: ReviewWithUser[];
  loading: boolean;
  error: string | null;
  refreshReviews: () => Promise<void>;
  createReview: (input: CreateReviewInput) => Promise<{ success: boolean; error?: any }>;
  updateReview: (reviewId: string, input: UpdateReviewInput) => Promise<{ success: boolean; error?: any }>;
  deleteReview: (reviewId: string) => Promise<{ success: boolean; error?: any }>;
  getReviewsByTrack: (trackId: string) => Promise<ReviewWithUser[]>;
  getUserReviewForTrack: (trackId: string) => Promise<ReviewWithUser | null>;
}

const ReviewsContext = createContext<ReviewsContextData>({} as ReviewsContextData);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper para obter o ID do usuário (compatível com modo dev e produção)
  const getUserId = useCallback(() => {
    if (!user) return null;
    return user.id || user.uid;
  }, [user]);

  // Carrega reviews (feed global ou de amigos)
  const refreshReviews = useCallback(async () => {
    if (!user) {
      setReviews([]);
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setReviews([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Tenta buscar reviews de amigos primeiro
      const { data: friendsReviews, error: friendsError } = await reviewsService.getFriendsReviews(userId);
      
      if (friendsError) {
        logWarning('Não foi possível buscar reviews de amigos');
      }

      // Se não há reviews de amigos, busca todas as reviews
      if (!friendsReviews || friendsReviews.length === 0) {
        const { data: allReviews, error: allError } = await reviewsService.getAllReviews(50);
        
        if (allError) {
          throw allError;
        }
        
        logDataLoad('reviews', allReviews?.length);
        setReviews(allReviews || []);
      } else {
        logDataLoad('reviews de amigos', friendsReviews.length);
        setReviews(friendsReviews);
      }
    } catch (err: any) {
      logError('Erro ao carregar reviews', err);
      setError(err.message || 'Erro ao carregar reviews');
    } finally {
      setLoading(false);
    }
  }, [user, getUserId]);

  // Cria uma nova review
  const createReview = useCallback(async (input: CreateReviewInput) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const userId = getUserId();
    if (!userId) {
      return { success: false, error: 'ID do usuário não encontrado' };
    }

    try {
      const { data, error } = await reviewsService.createReview(userId, input);
      
      if (error || !data) {
        throw error || new Error('Erro ao criar review');
      }

      logAction('Review criada com sucesso');
      
      // Atualiza a lista local
      await refreshReviews();
      
      return { success: true };
    } catch (err: any) {
      logError('Erro ao criar review', err);
      return { success: false, error: err };
    }
  }, [user, getUserId, refreshReviews]);

  // Atualiza uma review
  const updateReview = useCallback(async (reviewId: string, input: UpdateReviewInput) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const userId = getUserId();
    if (!userId) {
      return { success: false, error: 'ID do usuário não encontrado' };
    }

    try {
      const { data, error } = await reviewsService.updateReview(reviewId, userId, input);
      
      if (error || !data) {
        throw error || new Error('Erro ao atualizar review');
      }

      logAction('Review atualizada com sucesso');
      
      // Atualiza a lista local
      await refreshReviews();
      
      return { success: true };
    } catch (err: any) {
      logError('Erro ao atualizar review', err);
      return { success: false, error: err };
    }
  }, [user, getUserId, refreshReviews]);

  // Deleta uma review
  const deleteReview = useCallback(async (reviewId: string) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const userId = getUserId();
    if (!userId) {
      return { success: false, error: 'ID do usuário não encontrado' };
    }

    try {
      const { success, error } = await reviewsService.deleteReview(reviewId, userId);
      
      if (!success || error) {
        throw error || new Error('Erro ao deletar review');
      }

      logAction('Review deletada');
      
      // Atualiza a lista local
      await refreshReviews();
      
      return { success: true };
    } catch (err: any) {
      logError('Erro ao deletar review', err);
      return { success: false, error: err };
    }
  }, [user, getUserId, refreshReviews]);

  // Busca reviews de uma música específica
  const getReviewsByTrack = useCallback(async (trackId: string): Promise<ReviewWithUser[]> => {
    try {
      const { data, error } = await reviewsService.getReviewsByTrack(trackId);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      logError('Erro ao buscar reviews da música', err);
      return [];
    }
  }, []);

  // Busca review do usuário para uma música
  const getUserReviewForTrack = useCallback(async (trackId: string): Promise<ReviewWithUser | null> => {
    if (!user) return null;

    const userId = getUserId();
    if (!userId) return null;

    try {
      const { data, error } = await reviewsService.getUserReviewForTrack(userId, trackId);
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      logError('Erro ao buscar review do usuário', err);
      return null;
    }
  }, [user, getUserId]);

  // Carrega reviews ao montar o componente
  useEffect(() => {
    if (user) {
      refreshReviews();
    }
  }, [user, refreshReviews]);

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        loading,
        error,
        refreshReviews,
        createReview,
        updateReview,
        deleteReview,
        getReviewsByTrack,
        getUserReviewForTrack,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews deve ser usado dentro de ReviewsProvider');
  }
  return context;
}
