import React, { useState } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { TabsHeader } from "@/components/navigation/TabsNav";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CardReview } from "@/components/ui/CardReview";

const { width } = Dimensions.get('window');

type Playlist = { id: string; };
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
];

const PlaylistCard = () => {
  const theme = useTheme();
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme?.colors.box,
        borderColor: theme?.colors.primary,
      }
    ]} />
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
              {["Suas playlists", "Músicas Favoritas", "Popular entre amigos"].map((title) => (
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
                    data={playlistsData}
                    renderItem={() => <PlaylistCard />}
                    itemWidth={150}
                    gap={15}
                    style={{ height: 170 }}
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
          {/* Você pode adicionar outras tabs aqui */}
        </ScrollView>
        <BottomNav tabs={icons_navbar as any} />
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