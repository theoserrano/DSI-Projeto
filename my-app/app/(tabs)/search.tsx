import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import { useRouter } from 'expo-router';
import { BottomNav } from "@/components/navigation/BottomNav";
import songsData from "@/assets/data/songs.json";
import { SearchHeader } from "./searchTabs/SearchHeader";
import { SearchResults, SearchResult } from "./searchTabs/SearchResults";

const icons_navbar = [
  { icon: "home-outline", path: "/(tabs)/home" },
  { icon: "search-outline", path: "/(tabs)/search" },
  { icon: "add-circle", path: "/(tabs)/add" },
  { icon: "person-outline", path: "/(tabs)/profile" },
  { icon: "notifications-outline", path: "/(tabs)/notifications" },
];

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === "") {
      setResults([]);
      return;
    }

    const lower = text.toLowerCase();

    const filtered = songsData.songs.filter(
      (song) =>
        song.track_name.toLowerCase().includes(lower) ||
        song.track_artist.toLowerCase().includes(lower) ||
        song.track_album_name.toLowerCase().includes(lower)
    );

    setResults(filtered);
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <SearchHeader query={query} onQueryChange={handleSearch} />
          <SearchResults
            results={results}
            query={query}
            onItemPress={(item) => {
              // Navigate to the Song Info screen (currently shows the mock example)
              // include `from=search` so back can return to the search tab
              router.push((`/(tabs)/song/${item.id}?from=search`) as any);
            }}
            onAddPress={(item) => {
              console.log(`Adicionar "${item.track_name}" à playlist`);
            }}
          />
        </View>

        <BottomNav tabs={icons_navbar as any} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});