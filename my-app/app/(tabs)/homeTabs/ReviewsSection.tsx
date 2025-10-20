import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { useReviews } from "@/context/ReviewsContext";
import { CardReview } from "@/components/ui/CardReview";
import { getTrackById } from "@/services/tracks";
import type { ReviewWithUser } from "@/types/reviews";
import type { TrackWithStats } from "@/types/tracks";

type ReviewsSectionProps = {
  title?: string;
  onReportReview?: (review: ReviewWithUser, trackData?: TrackWithStats) => void;
};

export function ReviewsSection({ title = "Últimas Reviews", onReportReview }: ReviewsSectionProps) {
  const theme = useTheme();
  const { reviews, loading, error } = useReviews();

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
            />
          </View>
        ))}
      </View>
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
