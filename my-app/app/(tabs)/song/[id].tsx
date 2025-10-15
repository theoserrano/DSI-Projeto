import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import ReviewEditor from '@/components/ui/ReviewEditor';
import { CardReview } from '@/components/ui/CardReview';
import { ReportModal, ReportModalTarget } from '@/components/ui/ReportModal';
import { useReports } from '@/context/ReportsContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { NOTIFICATION_TYPES } from '@/types/notifications';
import type { CreateReportPayload } from '@/types/reports';

type Review = { id: string; user: string; rating: number; comment: string };

export default function SongInfo() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, from } = params as any;
  const [showEditor, setShowEditor] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportModalTarget | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const { createReport } = useReports();
  const { user, userCode } = useAuth();
  const { addNotification } = useNotifications();

  // fictional data for now
  const song = {
    id,
    track_name: 'Purple Rain',
    track_artist: 'Prince',
    track_album_name: 'Purple Rain',
    cover: 'https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51',
    average: 4.5,
  } as const;

  // TODO: replace the `song` mock above with real song data.
  // Recommended approach:
  // - Read params (id) and fetch the song by id from a store/backend, or
  // - Accept full song data via router params and use it here.

  const reviews: Review[] = [
    { id: '1', user: 'Ana Souza', rating: 5, comment: 'A música é incrível, sempre emociona.' },
    { id: '2', user: 'Carlos Lima', rating: 4, comment: 'Boa para relaxar e dirigir.' },
    { id: '3', user: 'Julia Mendes', rating: 4, comment: 'Melodia inesquecível.' },
  ];

  const reporterInfo = useMemo(() => {
    const reporterId = user?.uid ?? userCode ?? 'guest';
    const reporterName = user?.displayName ?? user?.email ?? userCode ?? 'Convidado';

    return {
      id: reporterId,
      name: reporterName,
    };
  }, [user, userCode]);

  const handleReportReview = (review: Review) => {
    setReportTarget({
      targetId: review.id,
      targetLabel: `Review de ${song.track_name} por ${review.user}`,
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

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme?.colors.background }}>
        <View style={[styles.container, { backgroundColor: theme?.colors.background }]}> 
          {/* Header com navegação */}
          <View style={styles.topNav}>
            <TouchableOpacity 
              onPress={() => {
                if (from === 'search') return router.push('/(tabs)/search' as any);
                if (from === 'playlists') return router.push('/(tabs)/home' as any);
                return router.back();
              }} 
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
                source={{ uri: song.cover }} 
                style={styles.cover} 
              />
            </View>

            {/* Info da música */}
            <View style={styles.songDetails}>
              <Text style={[styles.title, { color: theme?.colors.text }]}>
                {song.track_name}
              </Text>
              <Text style={[styles.artist, { color: theme?.colors.muted }]}>
                {song.track_artist}
              </Text>
              <Text style={[styles.album, { color: theme?.colors.muted }]}>
                {song.track_album_name}
              </Text>

              {/* Rating e ações */}
              <View style={styles.actionsRow}>
                <View style={styles.ratingContainer}>
                  <Text style={[styles.ratingNumber, { color: theme?.colors.text }]}>
                    {song.average.toFixed(1)}
                  </Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FontAwesome 
                        key={i} 
                        name="star" 
                        size={16} 
                        color={i < Math.round(song.average) ? theme?.colors.star : theme?.colors.muted} 
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
                {reviews.map((item) => (
                  <View key={item.id} style={{ marginBottom: 12 }}>
                    <CardReview
                      userName={item.user}
                      userAvatar={"https://randomuser.me/api/portraits/men/1.jpg"}
                      rating={item.rating}
                      songTitle={song.track_name}
                      artist={song.track_artist}
                      album={song.track_album_name}
                      cover={song.cover}
                      comment={item.comment}
                      onReportPress={() => handleReportReview(item)}
                    />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <ReviewEditor 
            visible={showEditor} 
            onClose={() => setShowEditor(false)} 
            songTitle={song.track_name} 
            cover={song.cover} 
            artist={song.track_artist} 
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
