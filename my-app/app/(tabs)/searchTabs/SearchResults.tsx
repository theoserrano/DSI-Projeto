import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export type SearchResult = {
  id?: number;
  track_id: string;
  track_name: string;
  track_artist: string;
  track_album_name: string;
  song_cover?: string;
};

type SearchResultsProps = {
  results: SearchResult[];
  query: string;
  onAddPress?: (song: SearchResult) => void;
  onItemPress?: (song: SearchResult) => void;
  isAddingMode?: boolean;
  isAddingToPlaylist?: boolean;
};

export function SearchResults({ results, query, onAddPress, onItemPress, isAddingMode = false, isAddingToPlaylist = false }: SearchResultsProps) {
  const theme = useTheme();

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => String(item.track_id)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.resultItem, 
            { 
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.box,
              borderRadius: theme.components.card.borderRadius,
            }
          ]}
          activeOpacity={0.8}
          onPress={() => onItemPress?.(item)}
          disabled={isAddingMode}
        >
          <Image
            source={{
              uri:
                item.song_cover ||
                "https://i.scdn.co/image/ab67616d0000b273c199494ba9ea2b73e9208f91",
            }}
            style={styles.albumImage}
          />
          <View style={styles.songInfo}>
            <Text style={[
              styles.songTitle, 
              { 
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.xl,
                fontFamily: theme.typography.fontFamily.bold,
              }
            ]} numberOfLines={1}>
              {item.track_name}
            </Text>
            <Text style={[
              styles.songArtist, 
              { 
                color: theme.colors.muted,
                fontSize: theme.typography.fontSize.base,
                fontFamily: theme.typography.fontFamily.regular,
              }
            ]} numberOfLines={2}>
              {item.track_artist} • {item.track_album_name}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.addButton, { borderColor: theme.colors.primary }]}
            onPress={() => onAddPress?.(item)}
            disabled={isAddingToPlaylist}
          >
            <Text style={[
              styles.addButtonLabel, 
              { 
                color: theme.colors.primary,
                fontSize: theme.typography.fontSize.title,
                fontFamily: theme.typography.fontFamily.bold,
              }
            ]}>{isAddingToPlaylist ? '...' : '+'}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={[
          styles.emptyText, 
          { 
            color: theme.colors.muted,
            fontSize: theme.typography.fontSize.base,
            fontFamily: theme.typography.fontFamily.regular,
          }
        ]}>
          {query ? "Nenhum resultado encontrado" : isAddingMode ? "Digite para buscar músicas" : "Digite algo para buscar"}
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 180,
    paddingHorizontal: 25,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
  },
  songArtist: {
    marginTop: 2,
  },
  addButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonLabel: {
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
  },
});
