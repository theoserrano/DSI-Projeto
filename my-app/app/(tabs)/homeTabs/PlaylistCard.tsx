import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export type SongSummary = {
  id?: string;
  track_name?: string;
  track_artist?: string;
  track_album_name?: string;
  image?: string;
  cover?: string;
};

type PlaylistCardProps = {
  song?: SongSummary;
  onPress?: () => void;
};

export function PlaylistCard({ song, onPress }: PlaylistCardProps) {
  const theme = useTheme();
  const coverUri = song?.image || song?.cover;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.box,
          borderColor: theme.colors.primary,
        },
      ]}
    >
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={[styles.placeholderText, { color: theme.colors.primary }]}> 
            {song?.track_name ? song.track_name.substring(0, 12) : "Song"}
          </Text>
        </View>
      )}
      {song?.track_name && (
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {song.track_name}
        </Text>
      )}
      {song?.track_artist && (
        <Text style={[styles.artist, { color: theme.colors.muted }]} numberOfLines={1}>
          {song.track_artist}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 190,
    borderRadius: 15,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cover: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  coverPlaceholder: {
    backgroundColor: "#DFEFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontWeight: "700",
    textAlign: "center",
  },
  title: {
    marginTop: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  artist: {
    fontSize: 12,
    marginTop: 4,
  },
});
