import React, { useState, useEffect, useMemo } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import { TabsHeader } from "@/components/navigation/TabsNav";
import ReviewModal from "@/components/ui/ReviewModal";
import { BottomNav } from "@/components/navigation/BottomNav";
import { PlaylistsSection } from "./homeTabs/PlaylistsSection";
import { ReviewsSection, Review } from "./homeTabs/ReviewsSection";
import { ShowsSection } from "./homeTabs/ShowsSection";
import { SongsSection, Song } from "./homeTabs/SongsSection";
import { SongSummary } from "./homeTabs/PlaylistCard";

const songsData = require("../spotify_songs.json") as Song[];

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

const playlistSectionTitles = [
  "Suas playlists",
  "Músicas Favoritas",
  "Popular entre amigos",
];

const reviewsMock: Review[] = [
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
  const [activeTab, setActiveTab] = useState("Playlists");
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongSummary | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSongs(songsData);
  }, []);

  const fallbackSong: SongSummary = useMemo(
    () => ({
      track_name: "Shape of You",
      track_artist: "Ed Sheeran",
      track_album_name: "Divide",
      image: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
    }),
    []
  );

  const playlistSections = useMemo(() => {
    const source = songs.length > 0 ? songs.slice(0, 5) : [fallbackSong];
    const items = source.map((song, index) => ({
      id: `playlist-${index}`,
      song,
    }));

    return playlistSectionTitles.map((title) => ({
      title,
      items,
    }));
  }, [fallbackSong, songs]);

  const handleSongSelect = (song: SongSummary) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  const renderScrollableContent = (children: React.ReactNode) => (
    <ScrollView contentContainerStyle={{ paddingBottom: 180 }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Playlists":
        return renderScrollableContent(
          <PlaylistsSection sections={playlistSections} onPlaylistPress={handleSongSelect} />
        );
      case "Reviews":
        return renderScrollableContent(
          <ReviewsSection reviews={reviewsMock} />
        );
      case "Shows":
        return renderScrollableContent(<ShowsSection />);
      case "Songs":
        return (
          <SongsSection songs={songs} onSongPress={handleSongSelect} />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <TabsHeader tabs={tabItems} activeTab={activeTab} onTabPress={setActiveTab} />
        {renderContent()}
        <BottomNav tabs={icons_navbar as any} />
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
