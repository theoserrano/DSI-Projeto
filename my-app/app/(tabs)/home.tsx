import React, { useMemo, useState, useEffect, useRef } from "react";
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Image, Animated, PanResponder, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { TabsHeader } from "@/components/navigation/TabsNav";
import { BottomNav } from "@/components/navigation/BottomNav";
import { logAction, logDataLoad, logError, logNavigation } from "@/utils/logger";
import { ReviewsSection } from "./homeTabs/ReviewsSection";
import { ShowsSection } from "./homeTabs/ShowsSection";
import { ReportModal, ReportModalTarget } from "@/components/ui/ReportModal";
import { useReports } from "@/context/ReportsContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { NOTIFICATION_TYPES } from "@/types/notifications";
import type { CreateReportPayload } from "@/types/reports";
import type { ReviewWithUser } from "@/types/reviews";
import type { TrackWithStats } from "@/types/tracks";
import { getPopularTracks, getRandomTracks, getTracksByGenre, getAllTracks, getFavoriteTracks } from "@/services/tracks";
import { getTrackById } from "@/services/tracks";
import { getRecentPlaylists, type Playlist } from "@/services/playlists";
import { DEFAULT_ALBUM_IMAGE_URL, DEFAULT_PLAYLIST_COVER_URL } from "@/constants/images";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

const icons_navbar = [
  { icon: "home-outline", path: "/(tabs)/home" },
  { icon: "search-outline", path: "/(tabs)/search" },
  { icon: "add-circle", path: "/(tabs)/add" },
  { icon: "person-outline", path: "/(tabs)/profile" },
  { icon: "notifications-outline", path: "/(tabs)/notifications" },
];

const tabItems = [
  { key: "Music", label: "Músicas" },
  { key: "Reviews", label: "Reviews" },
  { key: "Shows", label: "Shows" },
];

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Music");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportModalTarget | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const { createReport } = useReports();
  const { user, userCode } = useAuth();
  const { addNotification } = useNotifications();

  // Animação para swipe - position baseada no índice da aba
  const scrollViewRef = useRef<ScrollView>(null);
  const isSwipingRef = useRef(false);
  
  // Índice atual da aba (0 = Music, 1 = Reviews, 2 = Shows)
  const currentTabIndex = tabItems.findIndex(tab => tab.key === activeTab);
  
  // Animated value que representa a posição da página (-1, 0, 1, etc)
  const pagePosition = useRef(new Animated.Value(currentTabIndex)).current;

  // Estados para músicas e playlists
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<TrackWithStats[]>([]);
  const [popularTracks, setPopularTracks] = useState<TrackWithStats[]>([]);
  const [newDiscoveries, setNewDiscoveries] = useState<TrackWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Atualiza a posição quando a aba muda
  useEffect(() => {
    Animated.spring(pagePosition, {
      toValue: currentTabIndex,
      useNativeDriver: true,
      tension: 68,
      friction: 12,
    }).start();
  }, [currentTabIndex]);

  const changeTab = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= tabItems.length) return;
    
    const newTab = tabItems[newIndex].key;
    setActiveTab(newTab);
    logAction(`Swipe para aba: ${newTab}`);
    
    // Scrolla para o topo quando muda de aba
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, 50);
  };

  // PanResponder para swipe horizontal
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Ativa apenas para movimento horizontal significativo
          const isHorizontal = Math.abs(gestureState.dx) > 15 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
          if (isHorizontal && !isSwipingRef.current) {
            isSwipingRef.current = true;
          }
          return isHorizontal;
        },
        onMoveShouldSetPanResponderCapture: () => false,
        onPanResponderGrant: () => {
          isSwipingRef.current = true;
          pagePosition.stopAnimation();
        },
        onPanResponderMove: (_, gestureState) => {
          if (!isSwipingRef.current) return;
          
          // Calcula o deslocamento em "páginas" (1 página = largura da tela)
          const pageOffset = gestureState.dx / SCREEN_WIDTH;
          let newPosition = currentTabIndex - pageOffset;
          
          // Aplica resistência nos limites
          if (newPosition < 0) {
            newPosition = newPosition * 0.3;
          } else if (newPosition > tabItems.length - 1) {
            const excess = newPosition - (tabItems.length - 1);
            newPosition = tabItems.length - 1 + excess * 0.3;
          }
          
          pagePosition.setValue(newPosition);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (!isSwipingRef.current) {
            isSwipingRef.current = false;
            return;
          }
          
          const { dx, vx } = gestureState;
          
          // Determina se deve mudar de aba
          const shouldChangeTab = Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > SWIPE_VELOCITY_THRESHOLD;
          
          if (shouldChangeTab) {
            if (dx > 0 && currentTabIndex > 0) {
              // Swipe para direita - aba anterior
              changeTab(currentTabIndex - 1);
            } else if (dx < 0 && currentTabIndex < tabItems.length - 1) {
              // Swipe para esquerda - próxima aba
              changeTab(currentTabIndex + 1);
            } else {
              // Volta para posição original com animação suave
              Animated.spring(pagePosition, {
                toValue: currentTabIndex,
                useNativeDriver: true,
                tension: 68,
                friction: 12,
              }).start();
            }
          } else {
            // Volta para posição original com animação suave
            Animated.spring(pagePosition, {
              toValue: currentTabIndex,
              useNativeDriver: true,
              tension: 68,
              friction: 12,
            }).start();
          }
          
          isSwipingRef.current = false;
        },
        onPanResponderTerminate: () => {
          Animated.spring(pagePosition, {
            toValue: currentTabIndex,
            useNativeDriver: true,
            tension: 68,
            friction: 12,
          }).start();
          isSwipingRef.current = false;
        },
      }),
    [currentTabIndex, pagePosition]
  );

  // Carrega músicas ao montar componente
  useEffect(() => {
    logNavigation('Tela Home');
    loadTracks();
  }, [user]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      
      // Carrega dados básicos sempre
      const [popular, random] = await Promise.all([
        getPopularTracks(5),
        getRandomTracks(5),
      ]);
      
      // Carrega playlists e favoritos se o usuário estiver logado
      if (user?.id || user?.uid) {
        const userId = user.id || user.uid;
        
        // Carrega playlists do usuário
        const playlists = await getRecentPlaylists(userId, 5);
        setUserPlaylists(playlists);
        logDataLoad('playlists', playlists.length);
        
        // Carrega músicas favoritas
        const favorites = await getFavoriteTracks(userId, 5);
        setFavoriteTracks(favorites.map(track => ({
          ...track,
          cover: track.cover || DEFAULT_ALBUM_IMAGE_URL
        })));
        logDataLoad('favoritos', favorites.length);
      } else {
        // Se não estiver logado, deixa vazio
        setUserPlaylists([]);
        setFavoriteTracks([]);
      }
      
      setPopularTracks(popular.map(track => ({
        ...track,
        cover: track.cover || DEFAULT_ALBUM_IMAGE_URL
      })));
      
      setNewDiscoveries(random.map(track => ({
        ...track,
        cover: track.cover || DEFAULT_ALBUM_IMAGE_URL
      })));
      
      logDataLoad('músicas populares', popular.length);
    } catch (error) {
      logError('Erro ao carregar músicas', error);
    } finally {
      setLoading(false);
    }
  };

  const reporterInfo = useMemo(() => {
    const reporterId = user?.uid ?? userCode ?? "guest";
    const reporterName = user?.displayName ?? user?.email ?? userCode ?? "Convidado";

    return {
      id: reporterId,
      name: reporterName,
    };
  }, [user, userCode]);

  const handleReportReview = (review: ReviewWithUser, trackData?: TrackWithStats) => {
    setReportTarget({
      targetId: review.id,
      targetLabel: `Review de ${trackData?.track_name || 'música'} por ${review.user_name || 'usuário'}`,
      targetType: "review",
    });
    setReportModalVisible(true);
  };

  const submitReport = async (payload: CreateReportPayload) => {
    setIsSubmittingReport(true);
    try {
      logAction('Enviando denúncia');
      await createReport(payload);
      addNotification({
        type: NOTIFICATION_TYPES.GENERAL,
        title: "Denúncia registrada",
        message: "Nossa equipe vai analisar o conteúdo reportado.",
      });
      setReportModalVisible(false);
      setReportTarget(null);
      logAction('Denúncia enviada com sucesso');
    } catch (error) {
      logError('Falha ao registrar denúncia', error);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleTrackPress = (track: TrackWithStats) => {
    logAction(`Abriu música: ${track.track_name}`);
    router.push(`/(tabs)/song/${track.track_id}?from=home` as any);
  };

  const handlePlaylistPress = (playlist: Playlist) => {
    logAction(`Abriu playlist: ${playlist.name}`);
    router.push(`/song/playlistInfo?id=${playlist.id}` as any);
  };

  const renderPlaylistCard = (playlist: Playlist) => (
    <TouchableOpacity
      key={playlist.id}
      style={styles.musicCard}
      activeOpacity={0.85}
      onPress={() => handlePlaylistPress(playlist)}
    >
      <View style={styles.musicImageContainer}>
        <Image 
          source={{ uri: playlist.image_url || DEFAULT_PLAYLIST_COVER_URL }}
          style={styles.musicImage}
          defaultSource={{ uri: DEFAULT_PLAYLIST_COVER_URL }}
        />
      </View>
      <View style={styles.musicInfo}>
        <Text
          style={[styles.musicTitle, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {playlist.name}
        </Text>
        <Text
          style={[styles.musicArtist, { color: theme.colors.muted }]}
          numberOfLines={1}
        >
          {playlist.track_count} {playlist.track_count === 1 ? 'música' : 'músicas'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMusicCard = (track: TrackWithStats) => (
    <TouchableOpacity
      key={track.track_id}
      style={styles.musicCard}
      activeOpacity={0.85}
      onPress={() => handleTrackPress(track)}
    >
      <View style={styles.musicImageContainer}>
        <Image 
          source={{ uri: track.cover || DEFAULT_ALBUM_IMAGE_URL }}
          style={styles.musicImage}
          defaultSource={{ uri: DEFAULT_ALBUM_IMAGE_URL }}
        />
      </View>
      <View style={styles.musicInfo}>
        <Text
          style={[styles.musicTitle, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {track.track_name}
        </Text>
        <Text
          style={[styles.musicArtist, { color: theme.colors.muted }]}
          numberOfLines={1}
        >
          {track.track_artist}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title: string, subtitle: string, tracks: TrackWithStats[], showViewAll = false) => {
    if (tracks.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.sectionSubtitle, { color: theme.colors.muted }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {showViewAll && (
            <TouchableOpacity onPress={() => router.push("/(tabs)/search" as any)}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                Ver todos
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {tracks.slice(0, 5).map(renderMusicCard)}
        </ScrollView>
      </View>
    );
  };

  const renderPlaylistSection = (title: string, subtitle: string, playlists: Playlist[], showViewAll = false) => {
    if (playlists.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.sectionSubtitle, { color: theme.colors.muted }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {showViewAll && (
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile" as any)}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                Ver todos
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {playlists.slice(0, 5).map(renderPlaylistCard)}
        </ScrollView>
      </View>
    );
  };

  const renderMusicContent = () => (
    <>
      {/* Seção: Suas Playlists */}
      {renderPlaylistSection(
        "Suas Playlists",
        "Suas coleções personalizadas",
        userPlaylists,
        false
      )}

      {/* Seção: Músicas Favoritas */}
      {renderSection(
        "Músicas Favoritas",
        "Suas músicas mais tocadas",
        favoriteTracks,
        true
      )}

      {/* Seção: Popular Agora */}
      {renderSection(
        "Popular Agora",
        "As mais ouvidas do momento",
        popularTracks,
        true
      )}

      {/* Seção: Novas Descobertas */}
      {renderSection(
        "Novas Descobertas",
        "Músicas que você vai adorar",
        newDiscoveries,
        true
      )}
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Music":
        return renderMusicContent();
      case "Reviews":
        return <ReviewsSection onReportReview={handleReportReview} />;
      case "Shows":
        return <ShowsSection detailNote="" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Carregando conteúdo...
            </Text>
          </View>
          <BottomNav tabs={icons_navbar as any} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TabsHeader tabs={tabItems} activeTab={activeTab} onTabPress={setActiveTab} />
        
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [
                {
                  translateX: pagePosition.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, -SCREEN_WIDTH, -SCREEN_WIDTH * 2],
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Página 0: Music */}
          <View style={[styles.scrollContent, { width: SCREEN_WIDTH }]}>
            <ScrollView
              ref={activeTab === "Music" ? scrollViewRef : null}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              scrollEnabled={activeTab === "Music"}
            >
              {renderMusicContent()}
              <View style={styles.bottomSpacer} />
            </ScrollView>
          </View>

          {/* Página 1: Reviews */}
          <View style={[styles.scrollContent, { width: SCREEN_WIDTH }]}>
            <ScrollView
              ref={activeTab === "Reviews" ? scrollViewRef : null}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              scrollEnabled={activeTab === "Reviews"}
            >
              <ReviewsSection onReportReview={handleReportReview} />
              <View style={styles.bottomSpacer} />
            </ScrollView>
          </View>

          {/* Página 2: Shows */}
          <View style={[styles.scrollContent, { width: SCREEN_WIDTH }]}>
            <ScrollView
              ref={activeTab === "Shows" ? scrollViewRef : null}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              scrollEnabled={activeTab === "Shows"}
            >
              <ShowsSection detailNote="" />
              <View style={styles.bottomSpacer} />
            </ScrollView>
          </View>
        </Animated.View>

        <BottomNav tabs={icons_navbar as any} />
      </View>
      
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontFamily: "Sansation",
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    marginTop: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitleContainer: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    fontFamily: "SansationBold",
    fontSize: 20,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontFamily: "Sansation",
    fontSize: 14,
    lineHeight: 18,
  },
  viewAllText: {
    fontFamily: "SansationBold",
    fontSize: 14,
    marginTop: 4,
  },
  horizontalScroll: {
    paddingHorizontal: 24,
    gap: 16,
    paddingVertical: 4,
  },
  musicCard: {
    width: 140,
    marginRight: 0,
  },
  musicImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  musicImage: {
    width: "100%",
    height: "100%",
  },
  musicInfo: {
    paddingHorizontal: 4,
    gap: 4,
  },
  musicTitle: {
    fontFamily: "SansationBold",
    fontSize: 13,
    lineHeight: 18,
  },
  musicArtist: {
    fontFamily: "Sansation",
    fontSize: 12,
    lineHeight: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});