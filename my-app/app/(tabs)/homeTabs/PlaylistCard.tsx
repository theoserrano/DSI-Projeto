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
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.85} 
      onPress={onPress}
    >
      <View style={[styles.imageContainer, {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 6,
      }]}>
        <Image source={{ uri: song.image }} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text 
          style={[
            styles.title, 
            { 
              fontFamily: 'SansationBold',
              fontSize: 13,
              color: theme.colors.text,
            }
          ]} 
          numberOfLines={2}
        >
          {song.track_name}
        </Text>
        <Text 
          style={[
            styles.artist,
            {
              fontFamily: 'Sansation',
              fontSize: 11,
              color: theme.colors.muted,
            }
          ]} 
          numberOfLines={1}
        >
          {song.track_artist}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 130,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Formato quadrado para álbuns de música
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textContainer: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 4,
    lineHeight: 18,
  },
  artist: {
    lineHeight: 16,
  },
});
