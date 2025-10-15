import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { PlaylistCard } from "./PlaylistCard";
import { useRouter } from "expo-router";

// Tipos para as props
type SongSummary = {
  track_name: string;
  track_artist: string;
  track_album_name: string;
  image: string;
};

type PlaylistItem = {
  id: string;
  song: SongSummary;
};

type PlaylistSection = {
  title: string;
  items: PlaylistItem[];
};

type PlaylistsSectionProps = {
  sections: PlaylistSection[];
};

export function PlaylistsSection({ sections }: PlaylistsSectionProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {sections.map((section, idx) => (
        <View key={section.title} style={styles.section}>
          <Text 
            style={[
              styles.sectionTitle, 
              { 
                color: theme.colors.primary,
                fontFamily: theme.typography.fontFamily.bold,
              }
            ]}
          >
            {section.title}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.carouselContent}
          >
            {section.items.map((item) => {
              // Primeiro carrossel: abre tela de info da playlist
              if (idx === 0) {
                return (
                  <PlaylistCard 
                    key={item.id}
                    song={item.song}
                    onPress={() => router.push(`/song/playlistInfo?id=${item.id}` as any)}
                  />
                );
              }
              // Outros carrosseis: navega para tela de música
              return (
                <PlaylistCard 
                  key={item.id}
                  song={item.song}
                  onPress={() => router.push((`/(tabs)/song/${item.id}?from=playlists`) as any)}
                />
              );
            })}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SansationBold',
    marginLeft: 16,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  carouselContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
