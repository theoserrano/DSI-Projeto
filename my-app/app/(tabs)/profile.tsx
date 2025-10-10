import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { UpdateProfileModal } from '@/components/ui/UpdateProfileModal';

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
const UserPhoto = ({ name, photo, onEdit }: { name: string; photo: string | null; onEdit: () => void }) => {
  const theme = useTheme();
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
      {/* Botão editar perfil */}
      <TouchableOpacity style={styles.editButton} onPress={() => { Alert.alert('Editar pressionado'); onEdit(); }}>
        <Ionicons name="pencil" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      {/* Botão adicionar amigos */}
      <TouchableOpacity style={styles.addFriendButton} onPress={() => {/* ação de adicionar amigos */}}>
        <Ionicons name="person-add" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default function Home() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('Playlists');

  // Local state for profile editing (frontend only)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userName, setUserName] = useState('Theo Garrozi');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  const openEdit = () => setIsModalVisible(true);
  const closeEdit = () => setIsModalVisible(false);

  const handleSaveProfile = (name: string, photo: string | null) => {
    setUserName(name);
    setUserPhoto(photo);
    // Not persisting to backend now — only local state update as requested
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Foto do usuário centralizada */}
          <UserPhoto name={userName} photo={userPhoto} onEdit={openEdit} />

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
        </ScrollView>
        <UpdateProfileModal
          visible={isModalVisible}
          onClose={closeEdit}
          onSave={handleSaveProfile}
          currentName={userName}
          currentPhoto={userPhoto}
        />

        <BottomNav tabs={icons_navbar as any} />
      </View>
    </SafeAreaView>
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
});
