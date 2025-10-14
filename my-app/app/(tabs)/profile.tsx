import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { HorizontalCarousel } from '@/components/ui/HorizontalCarousel';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Ionicons } from '@expo/vector-icons';
import { UpdateProfileModal } from '@/components/ui/UpdateProfileModal';
import { AddFriendModal } from '@/components/ui/AddFriendModal';
import { useNotifications } from '@/context/NotificationsContext';
import { NOTIFICATION_TYPES } from '@/types/notifications';
import { supabase } from '@/services/supabaseConfig';

/*
  Refactored profile screen: small hooks + small components kept in-file
  - fetch profile & playlists with simple hooks
  - wire UpdateProfileModal and AddFriendModal
  - avoids verbose inline logic
*/

function useProfile(user: any) {
  const [profile, setProfile] = useState<any | null>(null);
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.from('profiles').select('name,username,avatar_url').eq('id', user.id).maybeSingle();
      if (error) console.error('fetch profile error', error);
      if (mounted) setProfile(data ?? null);
    })();
    return () => { mounted = false; };
  }, [user]);
  return profile;
}

function useUserPlaylists(user: any) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('id, name, image_url, is_public, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) console.error('fetch playlists error', error);
      if (mounted) setPlaylists(data ?? []);
    })();
    return () => { mounted = false; };
  }, [user]);
  return playlists;
}

function UserHeader({ name, photo, code, onEdit, onAddFriend }: { name: string; photo: string | null; code?: string | null; onEdit: () => void; onAddFriend: () => void }) {
  const theme = useTheme();
  return (
    <View style={styles.header}>
      <Image source={photo ? { uri: photo } : require('@/assets/images/icon.png')} style={[styles.avatar, { borderColor: theme.colors.primary }]} />
      <View style={{ alignItems: 'center' }}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
        <View style={[styles.codeBadge, { borderColor: theme.colors.primary, backgroundColor: theme.colors.box }]}>
          <Text style={[styles.codeText, { color: theme.colors.primary }]}>{code ?? '#0000000'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="pencil" size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addFriendButton} onPress={onAddFriend}>
        <Ionicons name="person-add" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

function UserPlaylistCard({ item, index }: { item: any; index: number }) {
  const theme = useTheme();
  const fallbacks = [require('@/assets/images/icon.png'), require('@/assets/images/splash-icon.png'), require('@/assets/images/favicon.png')];
  const image = item.image_url ? { uri: item.image_url } : fallbacks[index % fallbacks.length];
  return (
    <View style={[userStyles.playlistCard, { backgroundColor: theme.colors.box, borderColor: theme.colors.primary }]}> 
      <Image source={image} style={userStyles.playlistImage} />
      <Text style={[userStyles.playlistTitle, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</Text>
      <Text style={[userStyles.playlistMeta, { color: theme.colors.text }]}>{item.is_public ? 'Pública' : 'Privada'}</Text>
    </View>
  );
}

export default function Profile() {
  const theme = useTheme();
  const { user, userCode } = useAuth();
  const notifications = useNotifications();

  const profile = useProfile(user);
  const playlists = useUserPlaylists(user);

  const displayName = useMemo(() => profile?.name ?? user?.user_metadata?.name ?? user?.email ?? '', [profile, user]);
  const avatar = useMemo(() => profile?.avatar_url ?? null, [profile]);

  // modal states
  const [isEditVisible, setEditVisible] = useState(false);
  const [isAddFriendVisible, setAddFriendVisible] = useState(false);

  const openEdit = () => setEditVisible(true);
  const closeEdit = () => setEditVisible(false);
  const openAddFriend = () => setAddFriendVisible(true);
  const closeAddFriend = () => setAddFriendVisible(false);

  const handleSaveProfile = (name: string, photo: string | null) => {
    // front-only update for now
    Alert.alert('Perfil atualizado (front-only)');
  };

  const handleAddFriend = (friendName: string, message: string) => {
    notifications.addNotification({ type: NOTIFICATION_TYPES.FRIEND_REQUEST, title: friendName, message: message || undefined });
  };

  const icons_navbar = [
    { icon: 'home-outline', path: '/(tabs)/home' },
    { icon: 'search-outline', path: '/(tabs)/search' },
    { icon: 'add-circle', path: '/(tabs)/add' },
    { icon: 'person-outline', path: '/(tabs)/profile' },
    { icon: 'notifications-outline', path: '/(tabs)/notifications' },
  ];

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 180 }} showsVerticalScrollIndicator={false}>

          <UserHeader name={displayName} photo={avatar} code={userCode} onEdit={openEdit} onAddFriend={openAddFriend} />

          <View style={[styles.separator, { backgroundColor: theme.colors.primary + '33' }]} />

          <View style={{ marginTop: 30 }}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Minhas Playlists</Text>
            {playlists.length === 0 ? (
              <Text style={{ color: theme.colors.text, marginLeft: 25 }}>Você ainda não criou playlists.</Text>
            ) : (
              <HorizontalCarousel data={playlists} renderItem={({ item, index }) => <UserPlaylistCard item={item} index={index} />} itemWidth={150} gap={15} style={{ height: 220 }} />
            )}
          </View>

        </ScrollView>

        <UpdateProfileModal visible={isEditVisible} onClose={closeEdit} onSave={handleSaveProfile} currentName={displayName} currentPhoto={avatar} />

        <AddFriendModal visible={isAddFriendVisible} onClose={closeAddFriend} onAdd={handleAddFriend} />

        <BottomNav tabs={icons_navbar as any} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontFamily: 'SansationBold',
  },
  separator: {
    height: 2,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 1,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 25,
    marginBottom: 15,
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
});

const userStyles = StyleSheet.create({
  playlistCard: {
    width: 150,
    height: 200,
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
  },
  playlistImage: {
    width: 120,
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
  },
  playlistTitle: {
    fontSize: 14,
    fontFamily: 'SansationBold',
    marginBottom: 4,
  },
  playlistMeta: {
    fontSize: 12,
    color: '#888',
  },
});
