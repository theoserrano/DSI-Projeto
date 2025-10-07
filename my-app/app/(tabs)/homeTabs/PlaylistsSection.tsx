import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { PlaylistCard, SongSummary } from "./PlaylistCard";

type PlaylistCarouselItem = {
  id: string;
  song: SongSummary;
};

type Section = {
  title: string;
  items: PlaylistCarouselItem[];
};

type PlaylistsSectionProps = {
  sections: Section[];
  onPlaylistPress: (song: SongSummary) => void;
};

export function PlaylistsSection({ sections, onPlaylistPress }: PlaylistsSectionProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.primary },
            ]}
          >
            {section.title}
          </Text>

          <HorizontalCarousel
            data={section.items}
            renderItem={({ item }) => (
              <PlaylistCard
                song={item.song}
                onPress={() => onPlaylistPress(item.song)}
              />
            )}
            itemWidth={150}
            gap={15}
            style={styles.carousel}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 16,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 25,
    marginBottom: 15,
  },
  carousel: {
    height: 220,
  },
});
