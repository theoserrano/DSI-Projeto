import React, { useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import { TabsHeader } from "@/components/navigation/TabsNav";
import ReviewModal from "@/components/ui/ReviewModal";
import { BottomNav } from "@/components/navigation/BottomNav";
import { PlaylistsSection } from "./homeTabs/PlaylistsSection";
import { ReviewsSection, Review } from "./homeTabs/ReviewsSection";
import { ShowsSection } from "./homeTabs/ShowsSection";
import { SongSummary } from "./homeTabs/PlaylistCard";
import { ReportModal, ReportModalTarget } from "@/components/ui/ReportModal";
import { useReports } from "@/context/ReportsContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { NOTIFICATION_TYPES } from "@/types/notifications";
import type { CreateReportPayload } from "@/types/reports";

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

const reviewsMock: Review[] = [
  {
    id: "rev-001",
    userName: "Ana Souza",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    songTitle: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    cover: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
    comment: "Amo essa música! Sempre me anima.",
  },
  {
    id: "rev-002",
    userName: "Carlos Lima",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    songTitle: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
    comment: "Muito boa para ouvir dirigindo.",
  },
  {
    id: "rev-003",
    userName: "Julia Mendes",
    userAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 3,
    songTitle: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover: "https://i.scdn.co/image/ab67616d0000b27300ace5d3c5bffc123ef1eb51",
    comment: "Legal, mas enjoa rápido.",
  },
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

  const handleReportReview = (review: Review) => {
    setReportTarget({
      targetId: review.id ?? `${review.userName}-${review.songTitle}`,
      targetLabel: `Review de ${review.songTitle} por ${review.userName}`,
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
    <ScrollView contentContainerStyle={{ paddingBottom: 180 }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Playlists":
        return renderScrollableContent(
          <PlaylistsSection sections={playlistSections} onPlaylistPress={handleSongSelect} />
        );
      case "Reviews":
        return renderScrollableContent(
          <ReviewsSection reviews={reviewsMock} onReportReview={handleReportReview} />
        );
      case "Shows":
        return renderScrollableContent(<ShowsSection detailNote={""} />);
      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
