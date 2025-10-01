import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Ionicons } from "@expo/vector-icons";

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
        backgroundColor: theme.colors.boxBackground,
        borderColor: theme.colors.primary,
      }
    ]} />
  );
};

// Componente para foto do usuário
const UserPhoto = () => {
  const theme = useTheme();
  return (
    <View style={styles.photoContainer}>
      <Image
        source={require('@/assets/images/icon.png')} // Troque pelo caminho da foto do usuário
        style={[
          styles.photo,
          { borderColor: theme.colors.primary }
        ]}
      />
      <Text style={{ color: theme.colors.text, fontSize: 24, fontFamily: 'SansationBold', marginTop: 10 }}>Theo Garrozi</Text>
      {/* Botão editar perfil */}
      <TouchableOpacity style={styles.editButton} onPress={() => {/* ação de editar perfil */}}>
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

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Foto do usuário centralizada */}
          <UserPhoto />

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
