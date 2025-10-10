import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import InputContainer from "@/components/ui/InputContainer";
import { useTheme } from "@/context/ThemeContext";
import { BottomNav } from "@/components/navigation/BottomNav";
import songsData from "@/assets/data/songs.json";

interface Song {
  id: number;
  track_name: string;
  track_artist: string;
  track_album_name: string;
  song_cover: string;
}

const icons_navbar = [
  { icon: "home-outline", path: "/(tabs)/home" },
  { icon: "search-outline", path: "/(tabs)/search" },
  { icon: "add-circle", path: "/(tabs)/add" },
  { icon: "person-outline", path: "/(tabs)/profile" },
  { icon: "notifications-outline", path: "/(tabs)/notifications" },
];

export default function SearchScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);

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
          <Text style={[styles.title, { color: theme.colors.primary }]}>Buscar Música</Text>

          <InputContainer
            value={query}
            onChangeText={handleSearch}
            placeholder="Digite nome, artista ou álbum"
            icon={<Feather name="search" size={20} color={theme.colors.primary} />}
          />

          <FlatList
            data={results}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 180 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.resultItem, { borderColor: theme.colors.primary }]}
              >
                <Image
                  source={{ uri: item.song_cover || "https://akamai.sscdn.co/uploadfile/letras/albuns/f/2/a/b/01675173740.jpg" }}
                  style={styles.albumImage}
                />
                <View style={styles.songInfo}>
                  <Text style={[styles.songTitle, { color: theme.colors.text }]}>
                    {item.track_name}
                  </Text>
                  <Text style={[styles.songArtist, { color: theme.colors.muted }]}>
                    {item.track_artist} • {item.track_album_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                {query ? "Nenhum resultado encontrado" : "Digite algo para buscar"}
              </Text>
            }
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
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#F6FBFF",
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
    fontSize: 16,
    fontWeight: "600",
  },
  songArtist: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 14,
  },
});