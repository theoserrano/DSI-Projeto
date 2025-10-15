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
            fontSize: theme.typography.fontSize.h2,
            fontFamily: theme.typography.fontFamily.bold,
          },
        ]}
      >
        {title}
      </Text>
      {reviews.map((review, idx) => (
        <CardReview
          key={review.id ?? `${review.userName}-${idx}`}
          {...review}
          onReportPress={onReportReview ? () => onReportReview(review) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    marginLeft: 25,
    marginBottom: 15,
  },
});
