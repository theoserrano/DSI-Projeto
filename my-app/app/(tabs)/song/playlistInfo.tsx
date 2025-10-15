import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/services/supabaseConfig";
import { BottomNav } from "@/components/navigation/BottomNav";

type Song = {
  id: string;
  track_name: string;
  track_artist: string;
  track_album_name: string;
  image: string;
};

type Playlist = {
  id: string;
  name: string;
  image_url: string | null;
  is_public: boolean;
  user_id: string;
};

const icons_navbar = [
  { icon: "home-outline", path: "/(tabs)/home" },
  { icon: "search-outline", path: "/(tabs)/search" },
  { icon: "add-circle", path: "/(tabs)/add" },
  { icon: "person-outline", path: "/(tabs)/profile" },
  { icon: "notifications-outline", path: "/(tabs)/notifications" },
];

export default function PlaylistInfoScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaylistData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Buscar dados da playlist
      const { data: playlistData, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .single();

      if (playlistError) throw playlistError;
      setPlaylist(playlistData);

      // Buscar músicas da playlist - CORRIGIDO: usar playlist_tracks e tracks
      const { data: songsData, error: songsError } = await supabase
        .from('playlist_tracks')
        .select('track_id, tracks(*)')
        .eq('playlist_id', id)
        .order('added_at', { ascending: false });

      if (songsError) throw songsError;
      
      // Mapear para formato esperado
      const mappedSongs = songsData?.map((item: any) => ({
        id: item.track_id,
        track_name: item.tracks?.track_name || 'Desconhecido',
        track_artist: item.tracks?.track_artist || 'Desconhecido',
        track_album_name: item.tracks?.track_album_name || 'Desconhecido',
        image: 'https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51', // placeholder por enquanto
      })) || [];

      setSongs(mappedSongs);
    } catch (error: any) {
      console.error('Error fetching playlist:', error);
      Alert.alert('Erro', 'Não foi possível carregar a playlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistData();
  }, [id]);

  // Recarregar quando a tela ganhar foco (voltar da busca)
  useFocusEffect(
    React.useCallback(() => {
      fetchPlaylistData();
    }, [id])
  );

  const handleAddMusic = () => {
    // Redirecionar para a tela de busca com contexto da playlist
    router.push(`/(tabs)/search?playlistId=${id}&playlistName=${encodeURIComponent(playlist?.name || '')}` as any);
  };

  const handleShare = () => {
    // TODO: Implementar compartilhamento
    Alert.alert('Compartilhar', `Compartilhando playlist: ${playlist?.name}`);
  };

  const handleSongPress = (songId: string) => {
    router.push(`/(tabs)/song/${songId}?from=playlist` as any);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!playlist) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Playlist não encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ flex: 1 }}>
        {/* Seta de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Imagem da playlist */}
          <Image
            source={
              playlist.image_url 
                ? { uri: playlist.image_url } 
                : require('@/assets/images/icon.png')
            }
            style={[styles.playlistImage, { borderColor: theme.colors.primary }]}
          />
          
          {/* Título da playlist */}
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            {playlist.name}
          </Text>

          {/* Badge de pública/privada */}
          <View style={[styles.badge, { 
            backgroundColor: theme.colors.box,
            borderColor: theme.colors.primary 
          }]}>
            <Ionicons 
              name={playlist.is_public ? "globe-outline" : "lock-closed-outline"} 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
              {playlist.is_public ? 'Pública' : 'Privada'}
            </Text>
          </View>

          {/* Separador */}
          <View style={[styles.separator, { backgroundColor: theme.colors.primary + '33' }]} />

          {/* Botões de ação */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { 
                backgroundColor: theme.colors.box,
                borderColor: theme.colors.primary 
              }]} 
              onPress={handleAddMusic}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.primary }]}>
                Adicionar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { 
                backgroundColor: theme.colors.box,
                borderColor: theme.colors.primary 
              }]} 
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.primary }]}>
                Compartilhar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Separador */}
          <View style={[styles.separator, { backgroundColor: theme.colors.primary + '33' }]} />

          {/* Seção de músicas */}
          <View style={styles.songsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Músicas ({songs.length})
            </Text>

            {songs.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Nenhuma música adicionada ainda.
              </Text>
            ) : (
              songs.map((song) => (
                <TouchableOpacity 
                  key={song.id}
                  style={[styles.songItem, { borderBottomColor: theme.colors.border + '20' }]} 
                  onPress={() => handleSongPress(song.id)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: song.image }} style={styles.songImage} />
                  <View style={styles.songInfo}>
                    <Text 
                      style={[styles.songName, { 
                        color: theme.colors.text,
                        fontFamily: theme.typography.fontFamily.bold 
                      }]} 
                      numberOfLines={1}
                    >
                      {song.track_name}
                    </Text>
                    <Text 
                      style={[styles.songArtist, { 
                        color: theme.colors.textSecondary,
                        fontFamily: theme.typography.fontFamily.regular 
                      }]} 
                      numberOfLines={1}
                    >
                      {song.track_artist}
                    </Text>
                    <Text 
                      style={[styles.songAlbum, { 
                        color: theme.colors.muted,
                        fontFamily: theme.typography.fontFamily.regular 
                      }]} 
                      numberOfLines={1}
                    >
                      {song.track_album_name}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>

        <BottomNav tabs={icons_navbar as any} />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
    fontFamily: "SansationBold",
  },
  playlistImage: {
    width: 160,
    height: 160,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 80,
    marginBottom: 20,
    borderWidth: 3,
  },
  title: {
    fontSize: 28,
    fontFamily: "SansationBold",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 14,
    fontFamily: "SansationBold",
  },
  separator: {
    height: 2,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 1,
    marginVertical: 20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 30,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: "SansationBold",
  },
  songsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "SansationBold",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Sansation",
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    marginBottom: 3,
  },
  songArtist: {
    fontSize: 14,
    marginBottom: 2,
  },
  songAlbum: {
    fontSize: 12,
  },
});

