import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/services/supabaseConfig';
import { useAuth } from '@/context/AuthContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  track?: any | null;
  onAdded?: () => void;
};

export default function AddToPlaylistModal({ visible, onClose, track, onAdded }: Props) {
  const theme = useTheme();
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    let mounted = true;
    (async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('playlists')
        .select('id, name, image_url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) console.error('fetch playlists for modal', error);
      if (mounted) setPlaylists(data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [visible, user]);

  const addToPlaylist = async (playlistId: string) => {
    if (!track) {
      Alert.alert('Nenhuma música selecionada');
      return;
    }
    setAddingId(playlistId);
    const payload = {
      playlist_id: playlistId,
      track_id: track.track_id, // Corrigido: usar track_id ao invés de id
      added_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('playlist_tracks').insert(payload);
    setAddingId(null);
    if (error) {
      console.error('error adding to playlist', error);
      Alert.alert('Erro', 'Não foi possível adicionar a música à playlist.');
      return;
    }
    Alert.alert('Adicionado', `"${track.track_name}" adicionado(a) à playlist.`);
    onAdded?.();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.background }]}> 
          <Text style={[styles.title, { color: theme.colors.primary }]}>Adicionar à playlist</Text>

          {track ? (
            <Text style={[styles.trackTitle, { color: theme.colors.text }]} numberOfLines={2}>{track.track_name} — {track.track_artist}</Text>
          ) : (
            <Text style={{ color: theme.colors.muted }}>Selecione uma música para adicionar</Text>
          )}

          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={playlists}
              keyExtractor={(p) => String(p.id)}
              style={{ marginTop: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.playlistRow, { borderColor: theme.colors.primary }]}
                  onPress={() => addToPlaylist(item.id)}
                  disabled={addingId !== null}
                >
                  <Image source={ item.image_url ? { uri: item.image_url } : require('@/assets/images/icon.png') } style={styles.playlistImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.playlistName, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</Text>
                  </View>
                  <View style={{ width: 70, alignItems: 'flex-end' }}>{addingId === item.id ? <ActivityIndicator /> : <Text style={{ color: theme.colors.primary }}>Adicionar</Text>}</View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={{ color: theme.colors.muted, marginTop: 20 }}>Você não tem playlists.</Text>}
            />
          )}

          <TouchableOpacity style={[styles.closeButton, { borderColor: theme.colors.primary }]} onPress={onClose}>
            <Text style={{ color: theme.colors.primary }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  trackTitle: {
    marginTop: 8,
    fontSize: 14,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  playlistImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  }
});
