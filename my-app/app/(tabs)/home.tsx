
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { HorizontalCarousel } from '@/components/ui/HorizontalCarousel';

// --- Tipos e Dados (Mocks) ---
type Playlist = {
  id: string;
};

type Review = {
  id: string;
  userName: string;
  songName: string;
};

const playlistsData: Playlist[] = [{ id: '1' }, { id: '2' }, { id: '3' }];
const recommendedPlaylistsData: Playlist[] = [{ id: '4' }, { id: '5' }];

const reviewsData: Review[] = [
  { id: '1', userName: 'User A', songName: 'Song name' },
  { id: '2', userName: 'User B', songName: 'Another Song' },
];

const { width } = Dimensions.get('window');

// --- Componentes de Card ---
const PlaylistCard = () => (
  <View style={styles.playlistCard} />
);

const ReviewCard = ({ review }: { review: Review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewUserInfo}>
      <View style={styles.profilePic} />
      <Text style={styles.userName}>{review.userName}</Text>
    </View>
    <View style={styles.reviewContent}>
      <Text style={styles.songName}>{review.songName}</Text>
      <View style={styles.textBox}>
        <Text style={styles.textBoxText}>Text Box</Text>
      </View>
    </View>
  </View>
);

// --- Tela Principal ---
export default function Home() {
  const [activeTab, setActiveTab] = useState('Playlists');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Novo */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="settings-outline" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sound a beat</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Tabs de Navegação */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity onPress={() => setActiveTab('Playlists')}>
              <Text style={[styles.tabText, activeTab === 'Playlists' && styles.activeTabText]}>Playlists</Text>
              {activeTab === 'Playlists' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('Reviews')}>
              <Text style={[styles.tabText, activeTab === 'Reviews' && styles.activeTabText]}>Reviews</Text>
              {activeTab === 'Reviews' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          </View>

          {/* Seção Suas Playlists */}
          <Text style={styles.sectionTitle}>Suas playlists</Text>
          <HorizontalCarousel
            data={playlistsData}
            renderItem={() => <PlaylistCard />}
            itemWidth={150}
            gap={15}
          />

          {/* Seção Reviews */}
          <Text style={styles.sectionTitle}>Reviews</Text>
          <HorizontalCarousel
            data={reviewsData}
            renderItem={({ item }: any) => <ReviewCard review={item} />}
            itemWidth={280}
            gap={15}
          />

          {/* Seção Playlists Recomendadas */}
          <Text style={styles.sectionTitle}>Playlists recomendadas</Text>
          <HorizontalCarousel
            data={recommendedPlaylistsData}
            renderItem={() => <PlaylistCard />}
            itemWidth={150}
            gap={15}
          />

          {/* espaço extra para o conteúdo não ficar baixo da bottom bar */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* --- Bottom Navigation Bar (fixa) --- */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomItem} onPress={() => console.log('Home pressed')}>
            <Ionicons name="home-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomItem} onPress={() => console.log('Search pressed')}>
            <Ionicons name="search-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* FAB central com círculo azul bordado */}
          <View style={styles.fabWrapper}>
            <TouchableOpacity
              style={styles.fabButton}
              activeOpacity={0.85}
              onPress={() => console.log('Add pressed')}
            >
              <View style={styles.fabCircle}>
                <Ionicons name="add" size={36} color="#4DA1FF" />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.bottomItem} onPress={() => console.log('Profile pressed')}>
            <Ionicons name="person-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomItem} onPress={() => console.log('Notifications pressed')}>
            <Ionicons name="notifications-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B0F45',
  },
  container: {
    flex: 1,
    backgroundColor: '#0B0F45',
  },
  scrollContainer: {
    paddingBottom: 140, // garante espaço suficiente para não cortar conteúdo
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    marginTop: 8,
    gap: 25,
  },
  tabText: {
    color: '#888',
    fontSize: 18,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    height: 3,
    width: '100%',
    backgroundColor: '#3865FF',
    marginTop: 6,
    borderRadius: 2,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 25,
    marginTop: 30,
    marginBottom: 15,
  },
  playlistCard: {
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: '#D9D9D9', // Placeholder cinza
  },
  reviewCard: {
    width: 280,
    height: 160,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    padding: 15,
    flexDirection: 'row',
  },
  reviewUserInfo: {
    alignItems: 'center',
    marginRight: 15,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#A9A9A9',
    marginBottom: 10,
  },
  userName: {
    color: '#333',
    fontWeight: '600',
  },
  reviewContent: {
    flex: 1,
  },
  songName: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textBox: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
  },
  textBoxText: {
    color: '#000',
  },

  /* Bottom Bar */
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    backgroundColor: '#071033', // cor de fundo do mockup
    borderTopWidth: 1,
    borderTopColor: '#071233',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  bottomItem: {
    width: (width - 96) / 4, // deixa espaço central para o FAB
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* FAB */
  fabWrapper: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28, // eleva o FAB acima da barra como no mockup
  },
  fabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#071033',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#345CFF', // anel azul brilhante
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
});
