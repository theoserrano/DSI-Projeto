import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useReviews } from '@/context/ReviewsContext';
import { CustomButton } from './CustomButton';

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
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.drawerContainer, { backgroundColor: theme?.colors.card }]}>
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme?.colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme?.colors.border }]}>
            <Text style={[styles.headerTitle, { color: theme?.colors.primary }]}>
              {existingReview ? 'Editar Review' : 'Nova Review'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color={theme?.colors.text} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme?.colors.primary} />
              <Text style={[styles.loadingText, { color: theme?.colors.text }]}>Carregando...</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.scrollContent}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Song Info */}
              <View style={styles.songInfoSection}>
                {cover ? (
                  <Image source={{ uri: cover }} style={[styles.coverImage, { borderColor: theme?.colors.primary }]} />
                ) : null}
                <View style={styles.songDetails}>
                  <Text style={[
                    styles.songTitle, 
                    { 
                      color: theme?.colors.text,
                      fontFamily: theme?.typography.fontFamily.bold,
                    }
                  ]} numberOfLines={2}>{songTitle ?? 'Música'}</Text>
                  {artist ? (
                    <Text style={[
                      styles.artistName, 
                      { 
                        color: theme?.colors.muted,
                        fontFamily: theme?.typography.fontFamily.regular,
                      }
                    ]} numberOfLines={1}>{artist}</Text>
                  ) : null}
                </View>
              </View>

              {/* Rating Section */}
              <View style={styles.ratingSection}>
                <Text style={[styles.sectionLabel, { color: theme?.colors.text }]}>
                  Avaliação {rating > 0 && `(${rating}/5)`}
                </Text>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TouchableOpacity 
                      key={i} 
                      onPress={() => setRating(i + 1)} 
                      style={styles.starButton}
                      disabled={submitting}
                    >
                      <FontAwesome 
                        name={i < rating ? 'star' : 'star-o'} 
                        size={32} 
                        color={theme?.colors.star} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Comment Section */}
              <View style={styles.commentSection}>
                <Text style={[styles.sectionLabel, { color: theme?.colors.text }]}>
                  Comentário (opcional)
                </Text>
                <TextInput
                  placeholder="Compartilhe sua opinião sobre esta música..."
                  placeholderTextColor={theme?.colors.muted}
                  value={text}
                  onChangeText={setText}
                  multiline
                  editable={!submitting}
                  style={[
                    styles.commentInput, 
                    { 
                      backgroundColor: theme?.colors.background, 
                      color: theme?.colors.text,
                      borderColor: theme?.colors.border,
                    }
                  ]}
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={[styles.charCount, { color: theme?.colors.muted }]}>
                  {text.length}/500
                </Text>
              </View>
            </ScrollView>
          )}

          {/* Actions */}
          {!loading && (
            <View style={styles.actionsContainer}>
              {existingReview && (
                <CustomButton
                  title="Excluir Review"
                  onPress={handleDelete}
                  disabled={submitting}
                  width="auto"
                  height={48}
                  backgroundColor="#FF3B30"
                  textColor="#FFFFFF"
                  style={styles.deleteButton}
                />
              )}
              <View style={styles.mainActions}>
                <CustomButton
                  title="Cancelar"
                  onPress={onClose}
                  disabled={submitting}
                  width="auto"
                  height={52}
                  backgroundColor={theme?.colors.background}
                  textColor={theme?.colors.text}
                  style={[styles.actionButton, { borderWidth: 1, borderColor: theme?.colors.border }]}
                />
                <CustomButton
                  title={existingReview ? 'Atualizar' : 'Publicar'}
                  onPress={submit}
                  disabled={submitting}
                  width="auto"
                  height={52}
                  backgroundColor={theme?.colors.primary}
                  textColor="#FFFFFF"
                  style={styles.actionButton}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: 'SansationBold',
    fontSize: 20,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Sansation',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  songInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
  },
  ratingSection: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'SansationBold',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starButton: {
    padding: 8,
  },
  commentSection: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  commentInput: {
    minHeight: 120,
    maxHeight: 200,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    fontSize: 15,
    fontFamily: 'Sansation',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  deleteButton: {
    width: '100%',
  },
  mainActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
