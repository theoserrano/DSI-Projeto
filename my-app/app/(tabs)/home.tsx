import React, { useMemo, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { TabsHeader } from "@/components/navigation/TabsNav";
import { BottomNav } from "@/components/navigation/BottomNav";
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
import { DEFAULT_ALBUM_IMAGE, DEFAULT_PLAYLIST_COVER } from "@/constants/images";

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

  // Estados para músicas e playlists
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<TrackWithStats[]>([]);
  const [popularTracks, setPopularTracks] = useState<TrackWithStats[]>([]);
  const [newDiscoveries, setNewDiscoveries] = useState<TrackWithStats[]>([]);
  const [popTracks, setPopTracks] = useState<TrackWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega músicas ao montar componente
  useEffect(() => {
    loadTracks();
  }, [user]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      
      // Carrega dados básicos sempre
      const [popular, random, pop] = await Promise.all([
        getPopularTracks(5),
        getRandomTracks(5),
        getTracksByGenre("pop", 5),
      ]);
      
      // Carrega playlists e favoritos se o usuário estiver logado
      if (user?.id || user?.uid) {
        const userId = user.id || user.uid;
        
        // Carrega playlists do usuário
        const playlists = await getRecentPlaylists(userId, 5);
        setUserPlaylists(playlists);
        
        // Carrega músicas favoritas
        const favorites = await getFavoriteTracks(userId, 5);
        setFavoriteTracks(favorites.map(track => ({
          ...track,
          cover: track.cover || DEFAULT_ALBUM_IMAGE
        })));
      } else {
        // Se não estiver logado, deixa vazio
        setUserPlaylists([]);
        setFavoriteTracks([]);
      }
      
      setPopularTracks(popular.map(track => ({
        ...track,
        cover: track.cover || DEFAULT_ALBUM_IMAGE
      })));
      
      setNewDiscoveries(random.map(track => ({
        ...track,
        cover: track.cover || DEFAULT_ALBUM_IMAGE
      })));
      
      setPopTracks(pop.map(track => ({
        ...track,
        cover: track.cover || DEFAULT_ALBUM_IMAGE
      })));
    } catch (error) {
      if (__DEV__) {
        console.error("[Home] Erro ao carregar músicas:", error);
      }
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
      await createReport(payload);
      addNotification({
        type: NOTIFICATION_TYPES.GENERAL,
        title: "Denúncia registrada",
        message: "Nossa equipe vai analisar o conteúdo reportado.",
      });
      setReportModalVisible(false);
      setReportTarget(null);
    } catch (error) {
      if (__DEV__) {
        console.warn("[Home] Falha ao registrar denúncia:", error);
      }
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleTrackPress = (track: TrackWithStats) => {
    router.push(`/(tabs)/song/${track.track_id}?from=home` as any);
  };

  const handlePlaylistPress = (playlist: Playlist) => {
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
          source={playlist.image_url ? { uri: playlist.image_url } : DEFAULT_PLAYLIST_COVER} 
          style={styles.musicImage}
          defaultSource={DEFAULT_PLAYLIST_COVER}
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
          source={track.cover ? { uri: track.cover } : DEFAULT_ALBUM_IMAGE} 
          style={styles.musicImage}
          defaultSource={DEFAULT_ALBUM_IMAGE}
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

      {/* Seção: Pop Hits */}
      {renderSection(
        "Pop Hits",
        "Os maiores sucessos do pop",
        popTracks,
        false
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
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
          <View style={styles.bottomSpacer} />
        </ScrollView>

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