import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { CardReview } from "@/components/ui/CardReview";

export type Review = {
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
};

export function ReviewsSection({ title = "Últimas Reviews", reviews }: ReviewsSectionProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: theme.colors.primary },
        ]}
      >
        {title}
      </Text>
      {reviews.map((review, idx) => (
        <CardReview key={`${review.userName}-${idx}`} {...review} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 25,
    marginBottom: 15,
  },
});
