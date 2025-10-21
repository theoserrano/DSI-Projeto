import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { useReviews } from "@/context/ReviewsContext";
import { useNotifications } from "@/context/NotificationsContext";
import { CardReview } from "@/components/ui/CardReview";
import ReviewEditor from "@/components/ui/ReviewEditor";
import { getTrackById } from "@/services/tracks";
import { NOTIFICATION_TYPES } from "@/types/notifications";
import type { ReviewWithUser } from "@/types/reviews";
import type { TrackWithStats } from "@/types/tracks";

type ReviewsSectionProps = {
  title?: string;
  onReportReview?: (review: ReviewWithUser, trackData?: TrackWithStats) => void;
};

export function ReviewsSection({ title = "Últimas Reviews", onReportReview }: ReviewsSectionProps) {
  const theme = useTheme();
  const { reviews, loading, error, deleteReview, refreshReviews } = useReviews();
  const { addNotification } = useNotifications();
  const [showEditor, setShowEditor] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewWithUser | undefined>(undefined);
  const [editingTrack, setEditingTrack] = useState<TrackWithStats | undefined>(undefined);

  const handleEditReview = async (review: ReviewWithUser, track?: TrackWithStats) => {
    // Se não temos o track, busca ele
    if (!track) {
      track = await getTrackById(review.track_id) || undefined;
    }
    setEditingReview(review);
    setEditingTrack(track);
    setShowEditor(true);
  };

  const handleDeleteReview = async (review: ReviewWithUser) => {
    Alert.alert(
      'Excluir Review',
      'Tem certeza que deseja excluir esta review? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteReview(review.id);

              if (result.success) {
                addNotification({
                  type: NOTIFICATION_TYPES.GENERAL,
                  title: 'Review excluída',
                  message: 'Sua review foi excluída com sucesso.',
                });
                refreshReviews();
              } else {
                throw new Error(result.error);
              }
            } catch (error: any) {
              console.error('[ReviewsSection] Erro ao excluir review:', error);
              Alert.alert('Erro', 'Não foi possível excluir a review. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingReview(undefined);
    setEditingTrack(undefined);
    refreshReviews();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Carregando reviews...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>Erro ao carregar reviews</Text>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="chatbubble-outline" size={48} color={theme.colors.muted} />
        <Text style={[styles.emptyText, { color: theme.colors.muted }]}>Ainda não há reviews</Text>
        <Text style={[styles.emptySubtext, { color: theme.colors.muted }]}>
          Seja o primeiro a avaliar uma música!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { 
            color: theme.colors.primary,
            fontSize: 22,
            fontFamily: theme.typography.fontFamily.bold,
          },
        ]}
      >
        {title}
      </Text>
      <View style={styles.reviewsList}>
        {reviews.slice(0, 5).map((review, idx) => (
          <View key={review.id ?? `review-${idx}`} style={styles.reviewItem}>
            <CardReview
              review={review}
              onReportPress={onReportReview ? () => {
                // Busca track data se necessário
                getTrackById(review.track_id).then(track => {
                  onReportReview(review, track || undefined);
                });
              } : undefined}
              onEditPress={handleEditReview}
              onDeletePress={handleDeleteReview}
            />
          </View>
        ))}
      </View>

      {/* Editor de review */}
      {editingTrack && (
        <ReviewEditor
          visible={showEditor}
          onClose={handleEditorClose}
          songTitle={editingTrack.track_name}
          cover={editingTrack.cover}
          artist={editingTrack.track_artist}
          trackId={editingTrack.track_id}
          reviewToEdit={editingReview}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  title: {
    marginLeft: 16,
    marginBottom: 14,
    fontFamily: 'SansationBold',
    fontSize: 20,
    letterSpacing: 0.3,
  },
  reviewsList: {
    paddingHorizontal: 12,
    gap: 10,
  },
  reviewItem: {
    marginBottom: 6,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Sansation',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'SansationBold',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'SansationBold',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Sansation',
    textAlign: 'center',
  },
});
