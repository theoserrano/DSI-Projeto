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
import { updateProfile } from '@/services/profiles';
import { useRouter } from 'expo-router';

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
      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.primary,
          }]} 
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={20} color={theme.colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.primary,
          }]} 
          onPress={onAddFriend}
          activeOpacity={0.7}
        >
          <Ionicons name="person-add" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.avatarContainer, {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
      }]}>
        <Image 
          source={photo ? { uri: photo } : require('@/assets/images/icon.png')} 
          style={[styles.avatar, { borderColor: theme.colors.primary }]} 
        />
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
        <View style={[styles.codeBadge, { 
          borderColor: theme.colors.primary, 
          backgroundColor: theme.colors.card,
        }]}>
          <Ionicons name="key" size={14} color={theme.colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.codeText, { color: theme.colors.primary }]}>
            {code ?? '#0000000'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function UserPlaylistCard({ item, index, onPress }: { item: any; index: number; onPress: () => void }) {
  const theme = useTheme();
  const fallbacks = [require('@/assets/images/icon.png'), require('@/assets/images/splash-icon.png'), require('@/assets/images/favicon.png')];
  const image = item.image_url ? { uri: item.image_url } : fallbacks[index % fallbacks.length];
  return (
    <TouchableOpacity 
      style={[userStyles.playlistCard, { 
        backgroundColor: theme.colors.card,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }]}
      onPress={onPress}
      activeOpacity={0.8}
    > 
      <View style={userStyles.imageContainer}>
        <Image source={image} style={userStyles.playlistImage} />
      </View>
      <View style={userStyles.textContainer}>
        <Text style={[userStyles.playlistTitle, { 
          color: theme.colors.text,
          fontFamily: 'SansationBold',
        }]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={userStyles.metaRow}>
          <Ionicons 
            name={item.is_public ? 'globe-outline' : 'lock-closed-outline'} 
            size={12} 
            color={theme.colors.muted}
            style={{ marginRight: 4 }}
          />
          <Text style={[userStyles.playlistMeta, { 
            color: theme.colors.muted,
            fontFamily: 'Sansation',
          }]}>
            {item.is_public ? 'Pública' : 'Privada'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function Profile() {
  const theme = useTheme();
  const { user, userCode } = useAuth();
  const notifications = useNotifications();
  const router = useRouter();

  const profile = useProfile(user);
  const playlists = useUserPlaylists(user);

  const [profileData, setProfileData] = useState<any | null>(null);
  useEffect(() => {
    setProfileData(profile);
  }, [profile]);

  const displayName = useMemo(() => profileData?.name ?? user?.user_metadata?.name ?? user?.email ?? '', [profileData, user]);
  const avatar = useMemo(() => profileData?.avatar_url ?? null, [profileData]);

  // modal states
  const [isEditVisible, setEditVisible] = useState(false);
  const [isAddFriendVisible, setAddFriendVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const openEdit = () => setEditVisible(true);
  const closeEdit = () => setEditVisible(false);
  const openAddFriend = () => setAddFriendVisible(true);
  const closeAddFriend = () => setAddFriendVisible(false);

  const handleSaveProfile = async (name: string, photo: string | null) => {
    if (!user) return;
    setIsUpdating(true);
    try {
  await updateProfile(user.id, { name, avatar_url: photo ?? undefined });
      Alert.alert('Perfil atualizado com sucesso!');
      // Refetch profile
      const { data, error } = await supabase.from('profiles').select('name,username,avatar_url').eq('id', user.id).maybeSingle();
      if (!error) setProfileData(data ?? null);
    } catch (err: any) {
      Alert.alert('Erro ao atualizar perfil', err.message || 'Tente novamente.');
    } finally {
      setIsUpdating(false);
      closeEdit();
    }
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
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <UserHeader 
            name={displayName} 
            photo={avatar} 
            code={userCode} 
            onEdit={openEdit} 
            onAddFriend={openAddFriend} 
          />

          <View style={[styles.separator, { backgroundColor: theme.colors.muted + '40' }]} />

          <View style={styles.playlistsSection}>
            <Text style={[styles.sectionTitle, { 
              color: theme.colors.primary,
              fontFamily: theme.typography.fontFamily.bold,
            }]}>
              Minhas Playlists
            </Text>
            {playlists.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="musical-notes-outline" size={48} color={theme.colors.muted} />
                <Text style={[styles.emptyText, { 
                  color: theme.colors.muted,
                  fontFamily: theme.typography.fontFamily.regular,
                }]}>
                  Você ainda não criou playlists
                </Text>
              </View>
            ) : (
              <HorizontalCarousel 
                data={playlists} 
                renderItem={({ item, index }) => (
                  <UserPlaylistCard 
                    item={item} 
                    index={index} 
                    onPress={() => router.push(`/song/playlistInfo?id=${item.id}` as any)}
                  />
                )} 
                itemWidth={140} 
                gap={12} 
                style={{ height: 200 }} 
              />
            )}
          </View>
        </ScrollView>

        <UpdateProfileModal 
          visible={isEditVisible} 
          onClose={closeEdit} 
          onSave={handleSaveProfile} 
          currentName={displayName} 
          currentPhoto={avatar} 
        />

        <AddFriendModal 
          visible={isAddFriendVisible} 
          onClose={closeAddFriend} 
          onAdd={handleAddFriend} 
        />

        <BottomNav tabs={icons_navbar as any} />
      </View>
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
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    position: 'relative',
  },
  actionsRow: {
    position: 'absolute',
    top: 16,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    backgroundColor: '#f0f0f0',
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 26,
    fontFamily: 'SansationBold',
    marginBottom: 12,
  },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  codeText: {
    fontFamily: 'SansationBold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  separator: {
    height: 1,
    width: '88%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  playlistsSection: {
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SansationBold',
    marginLeft: 16,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'Sansation',
  },
});

const userStyles = StyleSheet.create({
  playlistCard: {
    width: 160,
    borderRadius: 10,
    marginHorizontal: 6,
    overflow: 'hidden',
    borderColor: "#000",
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Formato quadrado para álbuns de música
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  playlistImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8, 
    alignItems: 'center',
  },
  playlistTitle: {
    fontSize: 15,
    marginBottom: 6,
    lineHeight: 20,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistMeta: {
    fontSize: 11,
  },
});
