import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

type Review = {
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  song: { track_name?: string; track_artist?: string; track_album_name?: string; image?: string } | null;
  reviews?: Review[];
};

export default function ReviewModal({ visible, onClose, song, reviews = [] }: Props) {
  const theme = useTheme();
  const cover = song?.image || 'https://via.placeholder.com/300';

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme?.colors.background }]}> 
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="arrow-left" size={20} color={theme?.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.starButton}>
              <FontAwesome name="star-o" size={20} color={theme?.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.coverRow}>
            <Image source={{ uri: cover }} style={styles.cover} />
            <View style={styles.songText}>
              <Text style={[styles.title, { color: theme?.colors.primary }]}>{song?.track_name}</Text>
              <Text style={[styles.artist, { color: theme?.colors.text }]}>{song?.track_artist}</Text>
              <Text style={[styles.album, { color: theme?.colors.muted }]}>{song?.track_album_name}</Text>
            </View>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme?.colors.primary }]}> 
              <FontAwesome name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: theme?.colors.primary }]}>Reviews populares</Text>

          <FlatList
            data={reviews}
            keyExtractor={(_, i) => i.toString()}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 30 }}
            renderItem={({ item }) => (
              <View style={[styles.reviewCard, { backgroundColor: theme?.colors.card }]}> 
                <View style={styles.reviewHeader}>
                  <View style={styles.avatarCircle}>
                    <Text style={{ color: theme?.colors.primary }}>{item.userName?.[0] || 'U'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme?.colors.text, fontWeight: '700' }}>{`Avaliado por ${item.userName}`}</Text>
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
          />
        </View>
      </View>
    </Modal>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '92%',
    maxHeight: height * 0.9,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e6eef6',
    backgroundColor: '#e9f2f8',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    padding: 6,
  },
  starButton: {
    padding: 6,
  },
  coverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  cover: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 12,
  },
  songText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  artist: {
    fontSize: 14,
    marginTop: 6,
  },
  album: {
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 8,
  },
  reviewCard: {
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});
