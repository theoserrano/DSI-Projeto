import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export type Song = {
  track_name: string;
  track_artist: string;
  track_album_name: string;
  image?: string;
  cover?: string;
  [key: string]: any;
};

type SongsSectionProps = {
  songs: Song[];
  onSongPress: (song: Song) => void;
};

export function SongsSection({ songs, onSongPress }: SongsSectionProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: theme.colors.primary },
        ]}
      >
        Músicas
      </Text>

      <FlatList
        data={songs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onSongPress(item)}
            style={styles.songItem}
          >
            <Text style={[styles.songName, { color: theme.colors.text }]} numberOfLines={1}>
              {item.track_name}
            </Text>
            <Text style={[styles.songArtist, { color: theme.colors.text }]} numberOfLines={1}>
              {item.track_artist}
            </Text>
            <Text style={[styles.songAlbum, { color: theme.colors.muted }]} numberOfLines={1}>
              {item.track_album_name}
            </Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 24,
  },
  songItem: {
    paddingVertical: 10,
  },
  songName: {
    fontSize: 16,
    fontWeight: "600",
  },
  songArtist: {
    fontSize: 14,
  },
  songAlbum: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
});
