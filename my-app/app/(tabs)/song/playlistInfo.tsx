import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/services/supabaseConfig";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DEFAULT_ALBUM_IMAGE_URL, DEFAULT_PLAYLIST_COVER_URL } from "@/constants/images";
import { deletePlaylist } from "@/services/playlists";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

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
        image: DEFAULT_ALBUM_IMAGE_URL,
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
    console.log('Compartilhar playlist:', playlist?.name);
  };

  const handleEditPlaylist = () => {
    setNewPlaylistName(playlist?.name || "");
    setIsEditModalVisible(true);
  };

  const handleSavePlaylistName = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert('Erro', 'O nome da playlist não pode estar vazio.');
      return;
    }

    try {
      const { error } = await supabase
        .from('playlists')
        .update({ name: newPlaylistName.trim() })
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      setPlaylist(prev => prev ? { ...prev, name: newPlaylistName.trim() } : null);
      setIsEditModalVisible(false);
      // Nome atualizado com sucesso - feedback visual já está presente
    } catch (error: any) {
      console.error('Error updating playlist name:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o nome da playlist.');
    }
  };

  const handleSongPress = (songId: string) => {
    router.push(`/(tabs)/song/${songId}?from=playlist` as any);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRemoveSong = async (trackId: string) => {
    Alert.alert(
      'Remover música',
      'Deseja remover esta música da playlist?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('playlist_tracks')
                .delete()
                .eq('playlist_id', id)
                .eq('track_id', trackId);

              if (error) throw error;

              // Atualizar lista de músicas
              setSongs(prevSongs => prevSongs.filter(song => song.id !== trackId));
              // Música removida com sucesso - feedback visual já está presente
            } catch (error: any) {
              console.error('Error removing song:', error);
              Alert.alert('Erro', 'Não foi possível remover a música.');
            }
          }
        }
      ]
    );
  };

  const handleDeletePlaylist = async () => {
    if (!user?.id && !user?.uid) {
      Alert.alert('Erro', 'Você precisa estar logado para excluir uma playlist.');
      return;
    }

    Alert.alert(
      'Excluir Playlist',
      'Tem certeza que deseja excluir esta playlist? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = user.id || user.uid;
              const success = await deletePlaylist(id as string, userId);

              if (success) {
                // Playlist excluída com sucesso - voltar para a tela anterior
                router.back();
              } else {
                Alert.alert('Erro', 'Não foi possível excluir a playlist.');
              }
            } catch (error: any) {
              console.error('Error deleting playlist:', error);
              Alert.alert('Erro', 'Não foi possível excluir a playlist.');
            }
          }
        }
      ]
    );
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
        {/* Header com botões de navegação */}
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePlaylist}>
            <Ionicons name="trash-outline" size={26} color="#ff4444" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Imagem da playlist */}
          <Image
            source={{ uri: playlist.image_url || DEFAULT_PLAYLIST_COVER_URL }}
            defaultSource={{ uri: DEFAULT_PLAYLIST_COVER_URL }}
            style={[styles.playlistImage, { borderColor: theme.colors.primary }]}
          />
          
          {/* Título da playlist com botão de editar */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              {playlist.name}
            </Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditPlaylist}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

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
                <View 
                  key={song.id}
                  style={[styles.songItem, { borderBottomColor: theme.colors.border + '20' }]}
                >
                  <TouchableOpacity 
                    style={styles.songTouchable}
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
                  <TouchableOpacity 
                    style={styles.removeSongButton}
                    onPress={() => handleRemoveSong(song.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={22} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Modal para editar nome da playlist */}
        <Modal
          visible={isEditModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>
                Editar Nome da Playlist
              </Text>
              
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text,
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.background,
                }]}
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                placeholder="Nome da playlist"
                placeholderTextColor={theme.colors.muted}
                maxLength={50}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                  }]}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, { 
                    backgroundColor: theme.colors.primary,
                  }]}
                  onPress={handleSavePlaylistName}
                >
                  <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                    Salvar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <BottomNav tabs={icons_navbar as any} />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  deleteButton: {
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: "SansationBold",
    textAlign: "center",
  },
  editButton: {
    marginLeft: 12,
    padding: 6,
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
  songTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
  removeSongButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'SansationBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: 'Sansation',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'SansationBold',
  },
});

