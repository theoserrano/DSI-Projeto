import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { UpdateProfileModal } from '@/components/ui/UpdateProfileModal';
import { AddFriendModal } from '@/components/ui/AddFriendModal';
import { useNotifications } from '@/context/NotificationsContext';
import { useReports } from "@/context/ReportsContext";
import { Report } from "@/types/reports";
import { getStatusLabel } from "@/utils/reports";
import { ReportDetailsModal } from "@/components/ui/ReportDetailsModal";

const { width } = Dimensions.get('window');

type Playlist = { id: string; };
const playlistsData: Playlist[] = [{ id: '1' }, { id: '2' }, { id: '3' }];
const icons_navbar = [
  { icon: "home-outline", path: "/(tabs)/home" },
  { icon: "search-outline", path: "/(tabs)/search" },
  { icon: "add-circle", path: "/(tabs)/add" },
  { icon: "person-outline", path: "/(tabs)/profile" },
  { icon: "notifications-outline", path: "/(tabs)/notifications" },
];

const PlaylistCard = () => {
  const theme = useTheme();
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.colors.box,
        borderColor: theme.colors.primary,
      }
    ]} />
  );
};

// Componente para foto do usuário (recebe dados por props)
const UserPhoto = ({ name, photo, code, onEdit, onAddFriend }: { name: string; photo: string | null; code?: string | null; onEdit: () => void; onAddFriend: () => void }) => {
  const theme = useTheme();
  const displayCode = code || "#0000000";
  return (
    <View style={styles.photoContainer}>
      <Image
        source={photo ? { uri: photo } : require('@/assets/images/icon.png')} // Troque pelo caminho da foto do usuário
        style={[
          styles.photo,
          { borderColor: theme.colors.primary }
        ]}
      />
      <Text style={{ color: theme.colors.text, fontSize: 24, fontFamily: 'SansationBold', marginTop: 10 }}>{name}</Text>
      <View
        style={[
          styles.codeBadge,
          {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.box,
          },
        ]}
      >
        <Text style={[styles.codeText, { color: theme.colors.primary }]}>{displayCode}</Text>
      </View>
      {/* Botão editar perfil */}
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="pencil" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      {/* Botão adicionar amigos */}
      <TouchableOpacity style={styles.addFriendButton} onPress={onAddFriend}>
        <Ionicons name="person-add" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default function Home() {
  const theme = useTheme();
  const { user, userCode } = useAuth();

  // Local state for profile editing (frontend only)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userName, setUserName] = useState(user?.displayName || user?.email || 'Theo Garrozi');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isAddFriendVisible, setIsAddFriendVisible] = useState(false);
  const { addNotification } = useNotifications();
  const { reports, changeStatus } = useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [isUpdatingReport, setIsUpdatingReport] = useState(false);

  const openEdit = () => setIsModalVisible(true);
  const closeEdit = () => setIsModalVisible(false);
  const openAddFriend = () => setIsAddFriendVisible(true);
  const closeAddFriend = () => setIsAddFriendVisible(false);

  const handleSaveProfile = (name: string, photo: string | null) => {
    setUserName(name);
    setUserPhoto(photo);
    // Not persisting to backend now — only local state update as requested
  };

  const handleAddFriend = (friendName: string, message: string) => {
    addNotification(friendName);
  };

  const currentReporterId = useMemo(() => user?.uid ?? userCode ?? "guest", [user, userCode]);

  const myReports = useMemo(
    () => reports.filter((report) => report.reporterId === currentReporterId),
    [reports, currentReporterId]
  );

  const openReportDetails = (report: Report) => {
    setSelectedReport(report);
    setReportModalVisible(true);
  };

  const closeReportDetails = () => {
    setSelectedReport(null);
    setReportModalVisible(false);
  };

  const handleUpdateReport = async (payload: { id: string; status: Report["status"]; resolutionNotes?: string | null }) => {
    setIsUpdatingReport(true);
    try {
      await changeStatus(payload);
      closeReportDetails();
    } catch (error) {
      if (__DEV__) {
        console.warn("[Profile] Falha ao atualizar denúncia:", error);
      }
    } finally {
      setIsUpdatingReport(false);
    }
  };

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Foto do usuário centralizada */}
          <UserPhoto name={userName} photo={userPhoto} code={userCode} onEdit={openEdit} onAddFriend={openAddFriend} />

          {/* Linha horizontal */}
          <View style={[styles.separator, { backgroundColor: theme.colors.primary + '33' }]} />

          {["Playlists", "Músicas Favoritas"].map((title, idx) => (
            <View key={title} style={{ marginTop: 30 }}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginLeft: 25,
                  marginBottom: 15,
                }}
              >
                {title}
              </Text>
              <HorizontalCarousel
                data={playlistsData}
                renderItem={() => <PlaylistCard />}
                itemWidth={150}
                gap={15}
                style={{ height: 170 }}
              />
              {/* Linha horizontal entre os carrosséis */}
              {idx === 0 && (
                <View style={[styles.separator, { backgroundColor: theme.colors.primary + '33', marginTop: 30 }]} />
              )}
            </View>
          ))}

              <View style={{ marginTop: 30, paddingHorizontal: 24 }}>
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 15,
                  }}
                >
                  Minhas denúncias
                </Text>

                {myReports.length === 0 ? (
                  <Text style={{ color: theme.colors.muted }}>
                    Você ainda não enviou nenhuma denúncia. Utilize os botões de denúncia espalhados pelo app para relatar conteúdos.
                  </Text>
                ) : (
                  myReports.map((report) => (
                    <TouchableOpacity
                      key={report.id}
                      style={[
                        styles.reportCard,
                        {
                          backgroundColor: theme.colors.card,
                          borderColor: theme.colors.primary + '40',
                        },
                      ]}
                      onPress={() => openReportDetails(report)}
                      activeOpacity={0.85}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>{report.reason}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary + '18' }]}> 
                          <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '600' }}>
                            {getStatusLabel(report.status)}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: theme.colors.text, marginTop: 6 }}>{report.targetLabel}</Text>
                      {report.description ? (
                        <Text style={{ color: theme.colors.muted, marginTop: 4, fontSize: 12 }} numberOfLines={2}>
                          {report.description}
                        </Text>
                      ) : null}
                      <Text style={{ color: theme.colors.muted, marginTop: 8, fontSize: 12 }}>
                        Atualizado em {new Date(report.updatedAt ?? report.createdAt).toLocaleDateString('pt-BR')}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
        </ScrollView>
        <UpdateProfileModal
          visible={isModalVisible}
          onClose={closeEdit}
          onSave={handleSaveProfile}
          currentName={userName}
          currentPhoto={userPhoto}
        />

        <AddFriendModal
          visible={isAddFriendVisible}
          onClose={closeAddFriend}
          onAdd={handleAddFriend}
        />

        {/* notificações agora registradas no NotificationsContext (visíveis na aba Notifications) */}

        <BottomNav tabs={icons_navbar as any} />
      </View>
    </SafeAreaView>

      <ReportDetailsModal
        visible={reportModalVisible}
        report={selectedReport}
        onClose={closeReportDetails}
        onSubmit={handleUpdateReport}
        isSubmitting={isUpdatingReport}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 150,
    borderRadius: 15,
    borderWidth: 1,
    shadowColor: "#000",
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    backgroundColor: '#eee',
  },
  separator: {
    height: 2,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 1,
    marginVertical: 10,
  },
  editButton: {
    position: 'absolute',
    right: 20,
    top: 15,
    padding: 6,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#0A0F6D',
  },
  addFriendButton: {
    position: 'absolute',
    right: 20,
    top: 60,
    padding: 6,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#0A0F6D',
  },
  codeBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  codeText: {
    fontFamily: 'SansationBold',
    fontSize: 14,
    letterSpacing: 1,
  },
  reportCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
