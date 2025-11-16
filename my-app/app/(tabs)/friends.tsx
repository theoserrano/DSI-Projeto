import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFriends } from '@/hooks/useFriends';
import { FriendsList } from '@/components/ui/FriendsList';
import { AddFriendModal } from '@/components/ui/AddFriendModal';
import { BottomNav } from '@/components/navigation/BottomNav';
import { useNotifications } from '@/context/NotificationsContext';
import { NOTIFICATION_SECTION_LABELS } from '@/constants/notifications';
import { partitionNotifications } from '@/utils/notifications';
import type { Notification } from '@/types/notifications';

type FriendRequestCardProps = {
  request: Notification;
};

function FriendRequestCard({ request }: FriendRequestCardProps) {
  const theme = useTheme();
  const firstLetter = request.title.charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.notificationCard,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.primary,
          shadowColor: theme.colors.primary + "20",
        },
      ]}
    >
      <View
        style={[
          styles.avatar,
          { borderColor: theme.colors.primary, backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.avatarText, { color: theme.colors.primary }]}>{firstLetter}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.userName, { color: theme.colors.text }]}>{request.title}</Text>
        {request.message ? (
          <Text style={[styles.message, { color: theme.colors.muted }]} numberOfLines={2}>
            {request.message}
          </Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Ionicons name="checkmark-outline" size={26} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Ionicons name="close-outline" size={26} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FriendsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [addModalVisible, setAddModalVisible] = useState(false);

  const {
    friends,
    sendFriendRequest,
    removeFriend,
  } = useFriends();

  const { notifications } = useNotifications();
  const { friendRequests } = partitionNotifications(notifications);
  const hasFriendRequests = friendRequests.length > 0;

  const handleSendRequest = async (receiverId: string, message: string) => {
    try {
      await sendFriendRequest(receiverId, message);
      Alert.alert('Sucesso', 'Pedido de amizade enviado!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível enviar o pedido.');
    }
  };

  const handleRemoveFriend = async (friendId: string, friendName: string) => {
    try {
      await removeFriend(friendId);
      Alert.alert('Sucesso', `${friendName} foi removido da sua lista de amigos.`);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível remover o amigo.');
    }
  };

  const icons_navbar = [
    { icon: 'home-outline', path: '/(tabs)/home' },
    { icon: 'search-outline', path: '/(tabs)/search' },
    { icon: 'add-circle', path: '/(tabs)/add' },
    { icon: 'stats-chart-outline', path: '/(tabs)/dashboard' },
    { icon: 'person-outline', path: '/(tabs)/profile' },
  ];

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { 
          color: theme.colors.primary,
          fontFamily: 'SansationBold',
        }]}>
          Amigos & Notificações
        </Text>
        <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.addButton}>
          <Ionicons name="person-add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Friend Requests Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            {NOTIFICATION_SECTION_LABELS.FRIEND_REQUESTS}
          </Text>
          {hasFriendRequests ? (
            friendRequests.map((request) => (
              <FriendRequestCard key={request.id} request={request} />
            ))
          ) : (
            <Text style={[styles.emptyMessage, { color: theme.colors.muted }]}>
              Nenhum pedido de amizade por enquanto.
            </Text>
          )}
        </View>

        {/* Friends List Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Meus Amigos
          </Text>
          <FriendsList
            friends={friends}
            onRemoveFriend={handleRemoveFriend}
            onFriendPress={(friend) => {
              // Navegar para perfil do amigo (implementar depois)
              console.log('Ver perfil de:', friend.name);
            }}
          />
        </View>
      </ScrollView>

      <AddFriendModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleSendRequest}
      />

      <BottomNav tabs={icons_navbar as any} />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    marginBottom: 28,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SansationBold',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  emptyMessage: {
    marginHorizontal: 20,
    fontSize: 14,
    fontFamily: 'SansationBold',
    opacity: 0.8,
  },
  notificationCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'SansationBold',
  },
  userName: {
    fontSize: 16,
    fontFamily: 'SansationBold',
  },
  message: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: 'SansationBold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionButton: {
    marginLeft: 12,
  },
});
