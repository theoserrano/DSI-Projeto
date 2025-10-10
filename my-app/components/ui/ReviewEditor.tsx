import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  songTitle?: string;
  cover?: string;
  artist?: string;
};

export default function ReviewEditor({ visible, onClose, songTitle, cover, artist }: Props) {
  const theme = useTheme();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  const submit = () => {
    // Visual-only: log and close
    console.log('Review submitted', { songTitle, rating, text });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme?.colors.background, borderColor: theme?.colors.primary }]}> 
          <View style={styles.topRow}>
            {cover ? (
              <Image source={{ uri: cover }} style={styles.coverLeft} />
            ) : null}
            <View style={styles.titleArea}>
              <Text style={[styles.heading, { color: theme?.colors.primary }]} numberOfLines={2}>{songTitle ?? 'Escreva sua review'}</Text>
              {artist ? <Text style={[styles.artistText, { color: theme?.colors.muted }]} numberOfLines={1}>{artist}</Text> : null}
              <View style={styles.starsRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => setRating(i + 1)} style={{ padding: 6 }}>
                    <FontAwesome name={i < rating ? 'star' : 'star-o'} size={26} color={theme?.colors.star} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <TextInput
            placeholder="Digite aqui sua review."
            value={text}
            onChangeText={setText}
            multiline
            style={[styles.input, { backgroundColor: theme?.colors.card, color: theme?.colors.text }]}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={[styles.cancel, { borderColor: theme?.colors.primary }]} onPress={onClose}>
              <Text style={{ color: theme?.colors.primary, fontWeight: '700' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.send, { backgroundColor: theme?.colors.primary }]} onPress={submit}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '92%', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#bcd8f0', paddingTop: 18 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  coverLeft: { width: 92, height: 92, borderRadius: 10, marginRight: 12, borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 6 },
  titleArea: { flex: 1 },
  heading: { fontSize: 18, fontWeight: '900', marginBottom: 4 },
  artistText: { fontSize: 13, fontWeight: '600', marginBottom: 8, opacity: 0.9 },
  starsRow: { flexDirection: 'row', marginTop: 2 },
  input: { minHeight: 140, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#c7d7ef' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  cancel: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1 },
  send: { paddingVertical: 12, paddingHorizontal: 28, borderRadius: 22 },
});
