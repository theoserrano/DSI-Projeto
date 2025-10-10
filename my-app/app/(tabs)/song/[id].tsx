import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import ReviewEditor from '@/components/ui/ReviewEditor';
import { useState } from 'react';
import { CardReview } from '@/components/ui/CardReview';

type Review = { id: string; user: string; rating: number; comment: string };

export default function SongInfo() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, from } = params as any;
  const [showEditor, setShowEditor] = useState(false);

  // fictional data for now
  const song = {
    id,
    track_name: 'Purple Rain',
    track_artist: 'Prince',
    track_album_name: 'Purple Rain',
    cover: 'https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51',
    average: 4.5,
  } as const;

  // TODO: replace the `song` mock above with real song data.
  // Recommended approach:
  // - Read params (id) and fetch the song by id from a store/backend, or
  // - Accept full song data via router params and use it here.

  const reviews: Review[] = [
    { id: '1', user: 'Ana Souza', rating: 5, comment: 'A música é incrível, sempre emociona.' },
    { id: '2', user: 'Carlos Lima', rating: 4, comment: 'Boa para relaxar e dirigir.' },
    { id: '3', user: 'Julia Mendes', rating: 4, comment: 'Melodia inesquecível.' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme?.colors.background }]}> 
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => {
          if (from === 'search') return router.push('/(tabs)/search' as any);
          if (from === 'playlists') return router.push('/(tabs)/home' as any);
          return router.back();
        }} style={styles.iconButton}>
          <FontAwesome name="arrow-left" size={22} color={theme?.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="star-o" size={22} color={theme?.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.coverWrapCenter}>
        <Image source={{ uri: song.cover }} style={[styles.cover, { shadowColor: '#000' }]} />
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme?.colors.card }]}> 
        <Text style={[styles.title, { color: theme?.colors.primary }]}>{song.track_name}</Text>
        <Text style={[styles.artist, { color: theme?.colors.muted }]}>{song.track_artist}</Text>

        <View style={styles.infoRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: theme?.colors.text, fontWeight: '700', marginRight: 10 }}>{song.average.toFixed(1)}</Text>
            <View style={{ flexDirection: 'row' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesome key={i} name="star" size={18} color={i < Math.round(song.average) ? theme?.colors.star : theme?.colors.muted} style={{ marginRight: 6 }} />
              ))}
            </View>
          </View>

          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme?.colors.primary }]}>
            <FontAwesome name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.reviewsHeader}>
          <Text style={[styles.sectionTitle, { color: theme?.colors.primary }]}>Reviews populares</Text>
          <TouchableOpacity style={styles.pencilButton} onPress={() => setShowEditor(true)}>
            <FontAwesome name="pencil" size={16} color={theme?.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <CardReview
            userName={item.user}
            userAvatar={"https://randomuser.me/api/portraits/men/1.jpg"}
            rating={item.rating}
            songTitle={song.track_name}
            artist={song.track_artist}
            album={song.track_album_name}
            cover={song.cover}
            comment={item.comment}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />

      <ReviewEditor visible={showEditor} onClose={() => setShowEditor(false)} songTitle={song.track_name} cover={song.cover} artist={song.track_artist} />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, marginTop: 6 },
  iconButton: { padding: 6, marginTop: 6 },
  coverWrapCenter: { alignItems: 'center', marginTop: 6 },
  cover: { width: width * 0.56, height: width * 0.56, borderRadius: 12 },
  infoCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 12 },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  artist: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  addButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  pencilButton: { padding: 8, marginLeft: 8 },
  reviewCard: { borderRadius: 10, padding: 12, marginVertical: 8, marginHorizontal: 8 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
});
