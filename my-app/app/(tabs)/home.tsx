// app/home.tsx
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Playlist = {
  id: string;
  title: string;
  image: string;
};

type Review = {
  id: string;
  userName: string;
  userPic: string;
  songName: string;
  text: string;
};

const playlistsData: Playlist[] = [
  { id: '1', title: 'Playlist 1', image: "https://i1.sndcdn.com/avatars-xJQjwsZ0zMGavKMs-xrrIfA-t1080x1080.jpg" },
  { id: '2', title: 'Playlist 2', image: 'https://i1.sndcdn.com/avatars-xJQjwsZ0zMGavKMs-xrrIfA-t1080x1080.jpg' },
  { id: '3', title: 'Playlist 3', image: 'https://i1.sndcdn.com/avatars-xJQjwsZ0zMGavKMs-xrrIfA-t1080x1080.jpg' },
];

const reviewsData: Review[] = [
  { id: '1', userName: 'Théo', userPic: 'https://via.placeholder.com/50', songName: 'Nome 1', text: 'Lorem' },
  { id: '2', userName: 'Gabriel', userPic: 'https://via.placeholder.com/50', songName: 'Nome 2', text: 'Ipsum' },
];

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => (
  <View style={styles.playlistCard}>
    <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
    <Text style={styles.playlistTitle}>{playlist.title}</Text>
  </View>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <View style={styles.reviewCard}>
    <Image source={{ uri: review.userPic }} style={styles.profilePic} />
    <View style={styles.reviewContent}>
      <Text style={styles.songName}>{review.songName}</Text>
      <Text style={styles.reviewText}>{review.text}</Text>
      <Text style={styles.userName}>{review.userName}</Text>
    </View>
  </View>
);

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.userCircle}>
            {/* Aqui adiciona a foto do usuário */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendsButton}>
            <Text>Amigos</Text>
          </TouchableOpacity>
        </View>

        {/* Playlists */}
        <Text style={styles.sectionTitle}>Suas playlists</Text>
        <FlatList
          data={playlistsData}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <PlaylistCard playlist={item} />}
          style={{ marginBottom: 20 }}
        />

        {/* Reviews */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        <FlatList
          data={reviewsData}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <ReviewCard review={item} />}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="search" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0C2B' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  friendsButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userCircle: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  playlistCard: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  playlistImage: {
    backgroundColor: '#3e96dfff',
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  playlistTitle: {
    color: '#fff',
    marginTop: 5,
  },
  reviewCard: {
    backgroundColor: '#eeeeeeff',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    width: 250,
    height: 150,
  },
  profilePic: { width: 50, height: 50, borderRadius: 25, marginRight: 10, backgroundColor: '#0cb1c7ff' },
  reviewContent: { flex: 1 },
  songName: { fontWeight: 'bold', marginBottom: 5 },
  reviewText: { backgroundColor: '#00e5ff', padding: 6, borderRadius: 6, marginBottom: 5 },
  userName: { fontSize: 12, color: '#555' },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
