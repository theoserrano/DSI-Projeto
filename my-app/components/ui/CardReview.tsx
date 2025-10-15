import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

type CardReviewProps = {
  userName: string;
  userAvatar: string;
  rating: number;
  songTitle: string;
  artist: string;
  album: string;
  cover: string;
  comment: string;
  onReportPress?: () => void;
  hideReportButton?: boolean;
};

export function CardReview({
  userName,
  userAvatar,
  rating,
  songTitle,
  artist,
  album,
  cover,
  comment,
  onReportPress,
  hideReportButton,
}: CardReviewProps) {
  const theme = useTheme();
  const showReportAction = Boolean(onReportPress) && !hideReportButton;

  return (
    <View
      style={[
        styles.card,
        { 
          backgroundColor: theme?.colors.card,
          borderRadius: theme?.components.card.borderRadius,
          padding: theme?.components.card.padding,
          shadowOpacity: theme?.components.card.shadowOpacity,
          shadowRadius: theme?.components.card.shadowRadius,
          shadowOffset: theme?.components.card.shadowOffset,
          elevation: theme?.components.card.elevation,
        },
      ]}
    >
      {/* Header do usuário */}
      <View style={styles.header}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <View>
          <Text style={[
            styles.userName, 
            { 
              color: theme?.colors.text,
              fontSize: theme?.typography.fontSize.base,
              fontFamily: theme?.typography.fontFamily.regular,
            }
          ]}>
            {userName}
          </Text>
          <View style={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesome
                key={i}
                name="star"
                size={14}
                color={i < rating ? theme?.colors.star : theme?.colors.muted}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Música */}
      <View style={styles.songInfo}>
        <Image source={{ uri: cover }} style={styles.cover} />
        <View style={styles.textInfo}>
          <Text style={[
            styles.songTitle, 
            { 
              color: theme?.colors.text,
              fontSize: theme?.typography.fontSize.xl,
              fontFamily: theme?.typography.fontFamily.bold,
            }
          ]}>
            {songTitle}
          </Text>
          <Text style={[
            styles.artist, 
            { 
              color: theme?.colors.secondary,
              fontSize: theme?.typography.fontSize.base,
              fontFamily: theme?.typography.fontFamily.regular,
            }
          ]}>
            {artist}
          </Text>
          <Text style={[
            styles.album, 
            { 
              color: theme?.colors.muted,
              fontSize: theme?.typography.fontSize.sm,
              fontFamily: theme?.typography.fontFamily.regular,
            }
          ]}>
            {album}
          </Text>
        </View>
      </View>

      {/* Comentário */}
      <Text style={[
        styles.comment, 
        { 
          color: theme?.colors.text,
          fontSize: theme?.typography.fontSize.md,
          fontFamily: theme?.typography.fontFamily.regular,
        }
      ]}>
        <Text style={{ color: theme?.colors.primary }}>"</Text>
        {comment}
        <Text style={{ color: theme?.colors.primary }}>"</Text>
      </Text>

      {showReportAction && (
        <TouchableOpacity
          style={styles.reportButton}
          onPress={onReportPress}
          activeOpacity={0.6}
        >
          <Ionicons name="alert-circle-outline" size={16} color={theme?.colors.muted} />
          <Text style={[
            styles.reportLabel, 
            { 
              color: theme?.colors.muted,
              fontSize: theme?.typography.fontSize.sm,
              fontFamily: theme?.typography.fontFamily.regular,
            }
          ]}>Denunciar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userName: {
    fontWeight: "600",
  },
  stars: {
    flexDirection: "row",
    marginTop: 2,
  },
  songInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cover: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  textInfo: {
    flex: 1,
  },
  songTitle: {
    fontWeight: "700",
  },
  artist: {
  },
  album: {
  },
  comment: {
    fontStyle: "italic",
    marginTop: 6,
  },
  reportButton: {
    marginTop: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 4,
  },
  reportLabel: {
    fontWeight: "500",
  },
});
