import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { CardReview } from "@/components/ui/CardReview";

export type Review = {
  id?: string;
  userName: string;
  userAvatar: string;
  rating: number;
  songTitle: string;
  artist: string;
  album: string;
  cover: string;
  comment: string;
};

type ReviewsSectionProps = {
  title?: string;
  reviews: Review[];
  onReportReview?: (review: Review) => void;
};

export function ReviewsSection({ title = "Últimas Reviews", reviews, onReportReview }: ReviewsSectionProps) {
  const theme = useTheme();

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
        {reviews.map((review, idx) => (
          <View key={review.id ?? `${review.userName}-${idx}`} style={styles.reviewItem}>
            <CardReview
              {...review}
              onReportPress={onReportReview ? () => onReportReview(review) : undefined}
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
});
