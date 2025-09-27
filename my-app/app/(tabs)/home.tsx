import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Dimensions,
} from 'react-native';
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

// --- Componentes de Card ---
const PlaylistCard = () => (
  <View style={{
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: '#D9D9D9',
  }} />
);

// --- Tela Principal ---
export default function Home() {
  const [activeTab, setActiveTab] = useState('Playlists');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F45' }}>
      <View style={{ flex: 1, backgroundColor: '#0B0F45' }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Header
            title="Sound a beat"
            onLeftPress={() => {}}
            onRightPress={() => {}}
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
                color: 'white',
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
              />
            </View>
          ))}
        </ScrollView>

        <BottomNav tabs={icons_navbar as any} />
      </View>
    </SafeAreaView>
  );
}
