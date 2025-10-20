import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useReviews } from '@/context/ReviewsContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { useReports } from '@/context/ReportsContext';
import ReviewEditor from '@/components/ui/ReviewEditor';
import { CardReview } from '@/components/ui/CardReview';
import { ReportModal, ReportModalTarget } from '@/components/ui/ReportModal';
import { getTrackById } from '@/services/tracks';
import { NOTIFICATION_TYPES } from '@/types/notifications';
import type { CreateReportPayload } from '@/types/reports';
import type { TrackWithStats } from '@/types/tracks';
import type { ReviewWithUser } from '@/types/reviews';

export default function SongInfo() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params as any;
  
  const [track, setTrack] = useState<TrackWithStats | null>(null);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportModalTarget | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  
  const { getReviewsByTrack, getUserReviewForTrack, refreshReviews } = useReviews();
  const { createReport } = useReports();
  const { user, userCode } = useAuth();
  const { addNotification } = useNotifications();

  // Carrega dados da música e reviews
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Busca dados da música
        const trackData = await getTrackById(id);
        setTrack(trackData);

        // Busca reviews da música
        const reviewsData = await getReviewsByTrack(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('[SongInfo] Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id, getReviewsByTrack]);

  // Recarrega reviews quando o editor é fechado
  const handleEditorClose = async () => {
    setShowEditor(false);
    // Recarrega reviews
    const reviewsData = await getReviewsByTrack(id);
    setReviews(reviewsData);
    // Recarrega dados da música para atualizar estatísticas
    const trackData = await getTrackById(id);
    setTrack(trackData);
    // Atualiza o contexto global
    refreshReviews();
  };

  const reporterInfo = useMemo(() => {
    const reporterId = user?.uid ?? userCode ?? 'guest';
    const reporterName = user?.displayName ?? user?.email ?? userCode ?? 'Convidado';

    return {
      id: reporterId,
      name: reporterName,
    };
  }, [user, userCode]);

  const handleReportReview = (review: ReviewWithUser) => {
    setReportTarget({
      targetId: review.id,
      targetLabel: `Review de ${track?.track_name} por ${review.user_name || 'Usuário'}`,
      targetType: 'review',
    });
    setReportModalVisible(true);
  };

  const submitReport = async (payload: CreateReportPayload) => {
    setIsSubmittingReport(true);
    try {
      await createReport(payload);
      addNotification({
        type: NOTIFICATION_TYPES.GENERAL,
        title: 'Denúncia registrada',
        message: 'Recebemos sua denúncia e vamos avaliar o conteúdo em breve.',
        metadata: {
          category: 'report',
          targetType: payload.targetType,
          targetId: payload.targetId,
        },
      });
      setReportModalVisible(false);
      setReportTarget(null);
    } catch (error) {
      if (__DEV__) {
        console.warn('[SongInfo] Falha ao registrar denúncia:', error);
      }
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme?.colors.background }}>
        <View style={[styles.container, { backgroundColor: theme?.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={theme?.colors.primary} />
          <Text style={[styles.loadingText, { color: theme?.colors.text }]}>Carregando música...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Se não encontrou a música
  if (!track) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme?.colors.background }}>
        <View style={[styles.container, { backgroundColor: theme?.colors.background }]}>
          <View style={styles.topNav}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={theme?.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="musical-note-outline" size={64} color={theme?.colors.muted} />
            <Text style={[styles.errorText, { color: theme?.colors.text }]}>Música não encontrada</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme?.colors.background }}>
        <View style={[styles.container, { backgroundColor: theme?.colors.background }]}> 
          {/* Header com navegação */}
          <View style={styles.topNav}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={theme?.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.7}>
              <Ionicons name="heart-outline" size={24} color={theme?.colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Cover da música */}
            <View style={[styles.coverContainer, {
              shadowColor: theme?.colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }]}>
              <Image 
                source={{ uri: track.cover }} 
                style={styles.cover} 
              />
            </View>

            {/* Info da música */}
            <View style={styles.songDetails}>
              <Text style={[styles.title, { color: theme?.colors.primary }]}>
                {track.track_name}
              </Text>
              <Text style={[styles.artist, { color: theme?.colors.muted }]}>
                {track.track_artist}
              </Text>
              <Text style={[styles.album, { color: theme?.colors.muted }]}>
                {track.track_album_name}
              </Text>

              {/* Rating e ações */}
              <View style={styles.actionsRow}>
                <View style={styles.ratingContainer}>
                  <Text style={[styles.ratingNumber, { color: theme?.colors.text }]}>
                    {track.average_rating ? track.average_rating.toFixed(1) : '0.0'}
                  </Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FontAwesome 
                        key={i} 
                        name="star" 
                        size={16} 
                        color={i < Math.round(track.average_rating || 0) ? theme?.colors.star : theme?.colors.muted} 
                        style={{ marginRight: 4 }} 
                      />
                    ))}
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: theme?.colors.primary }]}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Seção de Reviews */}
            <View style={styles.reviewsSection}>
              <View style={styles.reviewsHeader}>
                <Text style={[styles.sectionTitle, { color: theme?.colors.primary }]}>
                  Reviews Populares
                </Text>
                <TouchableOpacity 
                  style={[styles.writeReviewButton, { 
                    backgroundColor: theme?.colors.box,
                    borderColor: theme?.colors.primary,
                  }]} 
                  onPress={() => setShowEditor(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={18} color={theme?.colors.primary} />
                  <Text style={[styles.writeReviewText, { color: theme?.colors.primary }]}>
                    Escrever
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Lista de reviews */}
              <View style={styles.reviewsList}>
                {reviews.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="chatbubble-outline" size={48} color={theme?.colors.muted} />
                    <Text style={[styles.emptyText, { color: theme?.colors.muted }]}>
                      Ainda não há reviews para esta música
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme?.colors.muted }]}>
                      Seja o primeiro a avaliar!
                    </Text>
                  </View>
                ) : (
                  reviews.map((item) => (
                    <View key={item.id} style={{ marginBottom: 12 }}>
                      <CardReview
                        review={item}
                        onReportPress={() => handleReportReview(item)}
                      />
                    </View>
                  ))
                )}
              </View>
            </View>
          </ScrollView>

          <ReviewEditor 
            visible={showEditor} 
            onClose={handleEditorClose} 
            songTitle={track.track_name} 
            cover={track.cover || ''} 
            artist={track.track_artist}
            trackId={track.track_id}
          />
        </View>
      </SafeAreaView>

      <ReportModal
        visible={reportModalVisible}
        onClose={() => {
          setReportModalVisible(false);
          setReportTarget(null);
        }}
        target={reportTarget}
        reporter={reporterInfo}
        onSubmit={submitReport}
        isSubmitting={isSubmittingReport}
      />
    </>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  topNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 12,
  },
  backButton: { 
    padding: 8,
    borderRadius: 8,
  },
  favoriteButton: { 
    padding: 8,
    borderRadius: 8,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  coverContainer: { 
    alignItems: 'center', 
    marginTop: 16,
    marginBottom: 20,
  },
  cover: { 
    width: width * 0.55,
    height: width * 0.55, // Formato quadrado para álbuns de música
    borderRadius: 12,
  },
  songDetails: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  title: { 
    fontSize: 26, 
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'SansationBold',
  },
  artist: { 
    fontSize: 16, 
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Sansation',
  },
  album: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Sansation',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingNumber: {
    fontSize: 24,
    fontFamily: 'SansationBold',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SansationBold',
  },
  reviewsSection: {
    paddingHorizontal: 16,
  },
  reviewsHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontFamily: 'SansationBold',
    letterSpacing: 0.3,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Sansation',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'SansationBold',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'SansationBold',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Sansation',
    textAlign: 'center',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  writeReviewText: {
    fontSize: 14,
    fontFamily: 'SansationBold',
  },
  reviewsList: {
    gap: 10,
  },
});
