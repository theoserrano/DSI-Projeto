import React, { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import { TabsHeader } from "@/components/navigation/TabsNav";
import ReviewModal from "@/components/ui/ReviewModal";
import { BottomNav } from "@/components/navigation/BottomNav";
import { PlaylistsSection } from "./homeTabs/PlaylistsSection";
import { ReviewsSection } from "./homeTabs/ReviewsSection";
import { ShowsSection } from "./homeTabs/ShowsSection";
import { SongSummary } from "./homeTabs/PlaylistCard";
import { ReportModal, ReportModalTarget } from "@/components/ui/ReportModal";
import { useReports } from "@/context/ReportsContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { NOTIFICATION_TYPES } from "@/types/notifications";
import type { CreateReportPayload } from "@/types/reports";
import type { ReviewWithUser } from "@/types/reviews";
import type { TrackWithStats } from "@/types/tracks";

const icons_navbar = [
  { icon: "home-outline", path: "/(tabs)/home" },
  { icon: "search-outline", path: "/(tabs)/search" },
  { icon: "add-circle", path: "/(tabs)/add" },
  { icon: "person-outline", path: "/(tabs)/profile" },
  { icon: "notifications-outline", path: "/(tabs)/notifications" },
];

const tabItems = [
  { key: "Playlists", label: "Playlists" },
  { key: "Reviews", label: "Reviews" },
  { key: "Shows", label: "Shows" },
];

const playlistSectionTitles = [
  "Suas playlists",
  "Músicas Favoritas",
  "Popular entre amigos",
];

const fallbackSongs: SongSummary[] = [
  {
    track_name: "Shape of You",
    track_artist: "Ed Sheeran",
    track_album_name: "Divide",
    image: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
  },
  {
    track_name: "Blinding Lights",
    track_artist: "The Weeknd",
    track_album_name: "After Hours",
    image: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
  },
  {
    track_name: "Levitating",
    track_artist: "Dua Lipa",
    track_album_name: "Future Nostalgia",
    image: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
  },
];

const playlistSections = playlistSectionTitles.map((title, idx) => ({
  title,
  items: fallbackSongs.map((song, i) => ({
    id: `playlist-${idx}-${i}`,
    song,
  })),
}));

export default function Home() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("Playlists");
  const [selectedSong, setSelectedSong] = useState<SongSummary | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportModalTarget | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const { createReport } = useReports();
  const { user, userCode } = useAuth();
  const { addNotification } = useNotifications();

  const handleSongSelect = (song: SongSummary) => {
    setSelectedSong(song);
    setShowModal(true);
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

  const renderScrollableContent = (children: React.ReactNode) => (
    <ScrollView 
      contentContainerStyle={styles.scrollContent} 
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Playlists":
        return renderScrollableContent(
          <PlaylistsSection sections={playlistSections} />
        );
      case "Reviews":
        return renderScrollableContent(
          <ReviewsSection onReportReview={handleReportReview} />
        );
      case "Shows":
        return renderScrollableContent(<ShowsSection detailNote={""} />);
      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TabsHeader tabs={tabItems} activeTab={activeTab} onTabPress={setActiveTab} />
        {renderContent()}
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
  scrollContent: {
    paddingBottom: 100,
  },
});