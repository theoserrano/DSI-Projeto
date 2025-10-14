import React, { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/services/supabaseConfig";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from 'expo-router';
import { BottomNav } from "@/components/navigation/BottomNav";
import songsData from "@/assets/data/songs.json";
import { SearchHeader } from "./searchTabs/SearchHeader";
import { SearchResults, SearchResult } from "./searchTabs/SearchResults";
import AddToPlaylistModal from '@/components/ui/AddToPlaylistModal';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SearchResult | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() !== "") handleSearch(query);
      else setResults([]);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearch = async (text: string) => {
    

    const lower = text.toLowerCase();

    const { data, error } = await supabase.from("tracks").
    select("*").or(`track_name.ilike.%${lower}%,track_artist.ilike.%${lower}%`).
    limit(20);
    if (error) {
      console.error("Supabase search error", error);
      return;
    }
    setResults(data || []);
    
  };

  const openAddModal = (item: SearchResult) => {
    setSelectedTrack(item);
    setModalVisible(true);
  };

  const closeAddModal = () => {
    setSelectedTrack(null);
    setModalVisible(false);
  };

  const handleAdded = () => {
    // noop for now; could show toast or refresh playlists
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <SearchHeader query={query} onQueryChange={setQuery} />
          <SearchResults
            results={results}
            query={query}
            onItemPress={(item) => {
              // Navigate to the Song Info screen (currently shows the mock example)
              // include `from=search` so back can return to the search tab
              router.push((`/(tabs)/song/${item.id}?from=search`) as any);
            }}
            onAddPress={(item) => openAddModal(item)}
          />
        </View>

        <BottomNav tabs={icons_navbar as any} />
  <AddToPlaylistModal visible={modalVisible} onClose={closeAddModal} track={selectedTrack} onAdded={handleAdded} />
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