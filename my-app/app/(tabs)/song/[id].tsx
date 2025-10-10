import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import ReviewEditor from '@/components/ui/ReviewEditor';
import { useState } from 'react';

type Review = { id: string; user: string; rating: number; comment: string };

export default function SongInfo() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params as any;
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

  const reviews: Review[] = [
    { id: '1', user: 'Ana Souza', rating: 5, comment: 'A música é incrível, sempre emociona.' },
    { id: '2', user: 'Carlos Lima', rating: 4, comment: 'Boa para relaxar e dirigir.' },
    { id: '3', user: 'Julia Mendes', rating: 4, comment: 'Melodia inesquecível.' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme?.colors.background }]}> 
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <FontAwesome name="arrow-left" size={22} color={theme?.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="star-o" size={22} color={theme?.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.coverArea}>
        <Image source={{ uri: song.cover }} style={styles.cover} />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme?.colors.primary }]}>
          <FontAwesome name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: theme?.colors.primary }]}>{song.track_name}</Text>
      <Text style={[styles.artist, { color: theme?.colors.text }]}>{song.track_artist}</Text>

      <View style={styles.ratingRow}>
        <Text style={{ color: theme?.colors.text, fontWeight: '700', marginRight: 8 }}>{song.average.toFixed(1)}</Text>
        <View style={{ flexDirection: 'row' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesome key={i} name="star" size={18} color={i < Math.round(song.average) ? theme?.colors.star : theme?.colors.muted} style={{ marginRight: 6 }} />
          ))}
        </View>
      </View>

      <View style={styles.sectionTitleRow}>
        <Text style={[styles.sectionTitle, { color: theme?.colors.primary }]}>Reviews populares</Text>
        <TouchableOpacity style={styles.pencilButton} onPress={() => setShowEditor(true)}>
          <FontAwesome name="pencil" size={16} color={theme?.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <View style={[styles.reviewCard, { backgroundColor: theme?.colors.card }]}> 
            <View style={styles.reviewHeader}>
              <View style={styles.avatarCircle}><Text style={{ color: theme?.colors.primary }}>{item.user?.[0] ?? 'U'}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme?.colors.text, fontWeight: '700' }}>{`Avaliado por ${item.user}`}</Text>
                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesome key={i} name="star" size={12} color={i < item.rating ? theme?.colors.star : theme?.colors.muted} style={{ marginRight: 4 }} />
                  ))}
                </View>
              </View>
            </View>
            <Text style={{ color: theme?.colors.text, marginTop: 10 }}>{item.comment}</Text>
          </View>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, marginTop: 6 },
  iconButton: { padding: 6, marginTop: 6 },
  coverArea: { alignItems: 'center', marginTop: 4 },
  cover: { width: width * 0.6, height: width * 0.6, borderRadius: 12 },
  addButton: { position: 'absolute', right: width * 0.2 - 20, bottom: 10, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 10 },
  artist: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginLeft: 0 },
  pencilButton: { padding: 8, marginLeft: 8 },
  reviewCard: { borderRadius: 10, padding: 12, marginVertical: 8, marginHorizontal: 8 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
});
