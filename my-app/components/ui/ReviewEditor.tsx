import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useReviews } from '@/context/ReviewsContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  songTitle?: string;
  cover?: string;
  artist?: string;
  trackId: string;
  reviewToEdit?: any; // Review existente para edição direta
};

export default function ReviewEditor({ visible, onClose, songTitle, cover, artist, trackId, reviewToEdit }: Props) {
  const theme = useTheme();
  const { createReview, updateReview, deleteReview, getUserReviewForTrack } = useReviews();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Verifica se o usuário já tem uma review para esta música
  useEffect(() => {
    async function checkExistingReview() {
      if (visible && trackId) {
        setLoading(true);
        
        // Se foi passada uma review para editar, usa ela diretamente
        if (reviewToEdit) {
          setExistingReview(reviewToEdit);
          setRating(reviewToEdit.rating);
          setText(reviewToEdit.comment || '');
        } else {
          // Caso contrário, busca a review do usuário
          const review = await getUserReviewForTrack(trackId);
          if (review) {
            setExistingReview(review);
            setRating(review.rating);
            setText(review.comment || '');
          } else {
            setExistingReview(null);
            setRating(0);
            setText('');
          }
        }
        
        setLoading(false);
      }
    }
    checkExistingReview();
  }, [visible, trackId, reviewToEdit, getUserReviewForTrack]);

  const submit = async () => {
    if (rating === 0) {
      Alert.alert('Atenção', 'Por favor, selecione uma avaliação (estrelas).');
      return;
    }

    setSubmitting(true);
    try {
      let result;
      
      if (existingReview) {
        // Atualiza review existente
        result = await updateReview(existingReview.id, {
          rating,
          comment: text || undefined,
        });
      } else {
        // Cria nova review
        result = await createReview({
          track_id: trackId,
          rating,
          comment: text || undefined,
        });
      }

      if (result.success) {
        // Review salva com sucesso - fechar modal
        setRating(0);
        setText('');
        setExistingReview(null);
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('[ReviewEditor] Erro ao salvar review:', error);
      Alert.alert('Erro', 'Não foi possível salvar a review. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    Alert.alert(
      'Excluir Review',
      'Tem certeza que deseja excluir esta review? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setSubmitting(true);
            try {
              const result = await deleteReview(existingReview.id);

              if (result.success) {
                // Review excluída com sucesso - fechar modal
                setRating(0);
                setText('');
                setExistingReview(null);
                onClose();
              } else {
                throw new Error(result.error);
              }
            } catch (error: any) {
              console.error('[ReviewEditor] Erro ao excluir review:', error);
              Alert.alert('Erro', 'Não foi possível excluir a review. Tente novamente.');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme?.colors.background, borderColor: theme?.colors.primary }]}> 
          {loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme?.colors.primary} />
              <Text style={[styles.loadingText, { color: theme?.colors.text }]}>Carregando...</Text>
            </View>
          ) : (
            <>
              <View style={styles.topRow}>
                {cover ? (
                  <Image source={{ uri: cover }} style={styles.coverLeft} />
                ) : null}
                <View style={styles.titleArea}>
                  <Text style={[
                    styles.heading, 
                    { 
                      color: theme?.colors.primary,
                      fontSize: theme?.typography.fontSize.xxl,
                      fontFamily: theme?.typography.fontFamily.bold,
                    }
                  ]} numberOfLines={2}>{songTitle ?? 'Escreva sua review'}</Text>
                  {artist ? <Text style={[
                    styles.artistText, 
                    { 
                      color: theme?.colors.muted,
                      fontSize: theme?.typography.fontSize.md,
                      fontFamily: theme?.typography.fontFamily.bold,
                    }
                  ]} numberOfLines={1}>{artist}</Text> : null}
                  {existingReview && (
                    <Text style={[styles.editingLabel, { color: theme?.colors.star }]}>
                      Editando sua review
                    </Text>
                  )}
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TouchableOpacity 
                        key={i} 
                        onPress={() => setRating(i + 1)} 
                        style={{ padding: 6 }}
                        disabled={submitting}
                      >
                        <FontAwesome name={i < rating ? 'star' : 'star-o'} size={26} color={theme?.colors.star} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <TextInput
                placeholder="Digite aqui sua review."
                placeholderTextColor={theme?.colors.muted}
                value={text}
                onChangeText={setText}
                multiline
                editable={!submitting}
                style={[styles.input, { backgroundColor: theme?.colors.card, color: theme?.colors.text }]}
              />

              <View style={styles.buttonsRow}>
                <TouchableOpacity 
                  style={[styles.cancel, { borderColor: theme?.colors.primary }]} 
                  onPress={onClose}
                  disabled={submitting}
                >
                  <Text style={{ 
                    color: theme?.colors.primary, 
                    fontFamily: theme?.typography.fontFamily.bold,
                    fontSize: theme?.typography.fontSize.base,
                  }}>Cancelar</Text>
                </TouchableOpacity>
                
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {existingReview && (
                    <TouchableOpacity 
                      style={[styles.deleteBtn, { 
                        backgroundColor: '#FF3B30',
                        opacity: submitting ? 0.6 : 1 
                      }]} 
                      onPress={handleDelete}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={{ 
                          color: '#fff', 
                          fontFamily: theme?.typography.fontFamily.bold,
                          fontSize: theme?.typography.fontSize.base,
                        }}>Excluir</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.send, { backgroundColor: theme?.colors.primary, opacity: submitting ? 0.6 : 1 }]} 
                    onPress={submit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={{ 
                        color: '#fff', 
                        fontFamily: theme?.typography.fontFamily.bold,
                        fontSize: theme?.typography.fontSize.base,
                      }}>
                        {existingReview ? 'Atualizar' : 'Enviar'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
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
  heading: { marginBottom: 4 },
  artistText: { marginBottom: 4, opacity: 0.9 },
  editingLabel: {
    fontSize: 12,
    fontFamily: 'SansationBold',
    marginBottom: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Sansation',
  },
  starsRow: { flexDirection: 'row', marginTop: 2 },
  input: { minHeight: 140, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#c7d7ef' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, alignItems: 'center' },
  cancel: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1 },
  deleteBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 22 },
  send: { paddingVertical: 12, paddingHorizontal: 28, borderRadius: 22 },
});
