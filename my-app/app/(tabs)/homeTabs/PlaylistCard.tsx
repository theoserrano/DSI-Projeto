import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

export type SongSummary = {
  track_name: string;
  track_artist: string;
  track_album_name: string;
  image: string;
};

type PlaylistCardProps = {
  song: SongSummary;
  onPress?: () => void;
};

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ song, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
    <Image source={{ uri: song.image }} style={styles.image} />
    <Text style={styles.title} numberOfLines={1}>{song.track_name}</Text>
    <Text style={styles.artist} numberOfLines={1}>{song.track_artist}</Text>
    <Text style={styles.album} numberOfLines={1}>{song.track_album_name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 180,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
  },
  artist: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  album: {
    fontSize: 12,
    color: "#888",
  },
});
