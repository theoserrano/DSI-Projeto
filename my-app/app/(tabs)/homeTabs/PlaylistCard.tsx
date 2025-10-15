import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export type SongSummary = {
  track_name: string;
  track_artist: string;
  track_album_name: string;
  image: string;
};

type PlaylistCardProps = {
  song: SongSummary;
  onPress: () => void;
};

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ song, onPress }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity style={[
      styles.card, 
      { 
        backgroundColor: theme.colors.card,
        borderRadius: theme.components.card.borderRadius,
        shadowColor: "#000",
        shadowOpacity: theme.components.card.shadowOpacity,
        shadowRadius: theme.components.card.shadowRadius,
        shadowOffset: theme.components.card.shadowOffset,
        elevation: theme.components.card.elevation,
      }
    ]} activeOpacity={0.85} onPress={onPress}>
      <Image source={{ uri: song.image }} style={styles.image} />
      <Text style={[
        styles.title, 
        { 
          fontFamily: theme.typography.fontFamily.bold,
          fontSize: theme.typography.fontSize.xl,
          color: theme.colors.text,
        }
      ]} numberOfLines={1}>{song.track_name}</Text>
      <Text style={[
        styles.artist,
        {
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.fontSize.base,
          color: theme.colors.textSecondary,
        }
      ]} numberOfLines={1}>{song.track_artist}</Text>
      <Text style={[
        styles.album,
        {
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.muted,
        }
      ]} numberOfLines={1}>{song.track_album_name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 5,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    marginBottom: 2,
  },
  artist: {
    marginBottom: 2,
  },
  album: {
  },
});
