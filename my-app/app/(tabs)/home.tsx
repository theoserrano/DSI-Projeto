import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { TabsHeader } from "@/components/navigation/TabsNav";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import ReviewModal from '@/components/ui/ReviewModal';
import { BottomNav } from "@/components/navigation/BottomNav";
import { CardReview } from "@/components/ui/CardReview";
const songsData = require('../spotify_songs.json');

const { width } = Dimensions.get('window');

type Playlist = { id: string; };
type Song = {
  track_name: string;
  track_artist: string;
  track_album_name: string;
  [key: string]: any;
};

const playlistsData: Playlist[] = [{ id: '1' }, { id: '2' }, { id: '3' }];
const icons_navbar = [
  { icon: "home-outline", path: "/(tabs)/home" },
  { icon: "search-outline", path: "/(tabs)/search" },
  { icon: "add-circle", path: "/(tabs)/add" },
  { icon: "person-outline", path: "/(tabs)/profile" },
  { icon: "notifications-outline", path: "/(tabs)/notifications" },
];

const tabItems = [
  { key: "Playlists", label: "Playlists" },
  { key: "Reviews", label: "Reviews" },
  { key: "Shows", label: "Shows" },
  { key: "Songs", label: "Songs" },
];

type PlaylistCardProps = { song?: Song; onPress?: () => void };

const PlaylistCard = ({ song, onPress }: PlaylistCardProps) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme?.colors.box,
          borderColor: theme?.colors.primary,
          padding: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }
      ]}
    >
      {song?.image || song?.cover ? (
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        <Image source={{ uri: song?.image || song?.cover }} style={{ width: 120, height: 120, borderRadius: 10 }} />
      ) : (
        <View style={{ width: 120, height: 120, borderRadius: 10, backgroundColor: '#dfefff', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme?.colors.primary, fontWeight: '700' }}>{song?.track_name ? song.track_name.substring(0,12) : 'Song'}</Text>
        </View>
      )}
      <Text style={{ marginTop: 8, color: theme?.colors.text, fontWeight: '700', textAlign: 'center' }}>{song?.track_name}</Text>
      <Text style={{ color: theme?.colors.muted, fontSize: 12 }}>{song?.track_artist}</Text>
    </TouchableOpacity>
  );
};

const reviewsMock = [
  {
    userName: "Ana Souza",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    songTitle: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    cover: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
    comment: "Amo essa música! Sempre me anima.",
  },
  {
    userName: "Carlos Lima",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    songTitle: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
    comment: "Muito boa para ouvir dirigindo.",
  },
  {
    userName: "Julia Mendes",
    userAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 3,
    songTitle: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
    comment: "Legal, mas enjoa rápido.",
  },
];

export default function Home() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('Playlists');
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [showModal, setShowModal] = useState(false);

  const sampleSong: Song = {
    track_name: 'Shape of You',
    track_artist: 'Ed Sheeran',
    track_album_name: 'Divide',
    image: 'https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51',
  } as Song;

  useEffect(() => {
    setSongs(songsData);
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme?.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme?.colors.background }}>
        <TabsHeader
          tabs={tabItems}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "Playlists" && (
            <>
              {['Suas playlists', 'Músicas Favoritas', 'Popular entre amigos'].map((title) => (
                <View key={title} style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      color: theme?.colors.primary,
                      fontSize: 24,
                      fontWeight: 'bold',
                      marginLeft: 25,
                      marginBottom: 15,
                    }}
                  >
                    {title}
                  </Text>
                  <HorizontalCarousel
                    data={[{ id: 'sample1' }, { id: 'sample2' }]}
                    renderItem={({ item }) => (
                      <PlaylistCard
                        song={sampleSong}
                        onPress={() => {
                          setSelectedSong(sampleSong);
                          setShowModal(true);
                        }}
                      />
                    )}
                    itemWidth={150}
                    gap={15}
                    style={{ height: 220 }}
                  />
                </View>
              ))}
            </>
          )}
          {activeTab === "Reviews" && (
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  color: theme?.colors.primary,
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginLeft: 25,
                  marginBottom: 15,
                }}
              >
                Últimas Reviews
              </Text>
              {reviewsMock.map((review, idx) => (
                <CardReview key={idx} {...review} />
              ))}
            </View>
          )}
          {activeTab === "Songs" && (
            <View style={{ marginTop: 20, paddingHorizontal: 25 }}>
              <Text
                style={{
                  color: theme?.colors.primary,
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginBottom: 15,
                }}
              >
                Músicas
              </Text>
              <FlatList
                data={songs}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedSong(item);
                      setShowModal(true);
                    }}
                    style={{ marginBottom: 10 }}
                  >
                    <Text style={{ color: theme?.colors.text, fontSize: 16 }}>{item.track_name}</Text>
                    <Text style={{ color: theme?.colors.text, fontSize: 14 }}>{item.track_artist}</Text>
                    <Text style={{ color: theme?.colors.text, fontSize: 12 }}>{item.track_album_name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </ScrollView>
        <BottomNav tabs={icons_navbar as any} />
        {/* Review Modal */}
        {/** Lazy require to avoid issues on web/SSR */}
        {showModal && (
          <ReviewModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            song={{
              track_name: selectedSong?.track_name,
              track_artist: selectedSong?.track_artist,
              track_album_name: selectedSong?.track_album_name,
              image: selectedSong?.image || selectedSong?.cover || undefined,
            }}
            reviews={reviewsMock as any}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 150,
    borderRadius: 15,
    borderWidth: 1,
    shadowColor: "#000",
  },
});
