import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Dimensions,
} from 'react-native';

import { Colors } from "@/constants/Colors";
import { HorizontalCarousel } from '@/components/ui/HorizontalCarousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Header } from '@/components/navigation/Header';
import { TabsHeader } from '@/components/navigation/TabsNav';

const { width } = Dimensions.get('window');

// --- Tipos e Dados (Mocks) ---
type Playlist = { id: string; };
type Review = { id: string; userName: string; songName: string; };

const playlistsData: Playlist[] = [{ id: '1' }, { id: '2' }, { id: '3' }];
const icons_navbar = [
  { icon: "home-outline" },
  { icon: "search-outline"},
  { icon: "add-circle" },
  { icon: "person-outline"},
  { icon: "notifications-outline"},
];

const tabItems = [
  { key: "Playlists", label: "Playlists" },
  { key: "Reviews", label: "Reviews" },
];

const PlaylistCard = () => (
  <View style={{
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: Colors.softWhite, // Corrigido para cor do card
    outlineColor: Colors.primaryColor,
    outlineWidth: 1,
    shadowColor: "#000",
  }} />
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('Playlists');

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Header
            title="Sound a beat"
            // onLeftPress={() => {}}
            // onRightPress={() => {}}
          />

          {/* Tabs */}
          <TabsHeader
            tabs={tabItems}
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />

          {/* Seções */}
          {["Suas playlists", "Músicas Favoritas", "Popular entre amigos"].map((title) => (
            <View key={title} style={{ marginTop: 30 }}>
              <Text style={{
                color: Colors.primaryColor,
                fontSize: 24,
                fontWeight: 'bold',
                marginLeft: 25,
                marginBottom: 15,
              }}>{title}</Text>

              <HorizontalCarousel
                data={playlistsData}
                renderItem={() => <PlaylistCard />}
                itemWidth={150}
                gap={15}
                style={{ height: 160 }} // altura maior que o card (150)
              />
            </View>
          ))}
        </ScrollView>

        <BottomNav tabs={icons_navbar as any} />
      </View>
    </SafeAreaView>
  );
}