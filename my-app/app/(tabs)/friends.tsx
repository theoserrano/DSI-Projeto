import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFriends } from '@/hooks/useFriends';
import { FriendRequestsList } from '@/components/ui/FriendRequestsList';
import { FriendsList } from '@/components/ui/FriendsList';
import { AddFriendModal } from '@/components/ui/AddFriendModal';
import { BottomNav } from '@/components/navigation/BottomNav';

type Tab = 'friends' | 'requests';

export default function FriendsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [addModalVisible, setAddModalVisible] = useState(false);

  const {
    friends,
    receivedRequests,
    pendingCount,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  } = useFriends();

  const handleSendRequest = async (receiverId: string, message: string) => {
    try {
      await sendFriendRequest(receiverId, message);
      Alert.alert('Sucesso', 'Pedido de amizade enviado!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível enviar o pedido.');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      Alert.alert('Sucesso', 'Pedido de amizade aceito!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível aceitar o pedido.');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível rejeitar o pedido.');
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
    { icon: 'person-outline', path: '/(tabs)/profile' },
    { icon: 'notifications-outline', path: '/(tabs)/notifications' },
  ];

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { 
          color: theme.colors.primary,
          fontFamily: 'SansationBold',
        }]}>
          Amigos
        </Text>
        <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.addButton}>
          <Ionicons name="person-add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'friends' && { 
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => setActiveTab('friends')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'friends' ? theme.colors.primary : theme.colors.muted} 
          />
          <Text style={[
            styles.tabText,
            { 
              color: activeTab === 'friends' ? theme.colors.primary : theme.colors.muted,
              fontFamily: activeTab === 'friends' ? 'SansationBold' : 'Sansation',
            },
          ]}>
            Meus Amigos ({friends.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'requests' && { 
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => setActiveTab('requests')}
          activeOpacity={0.7}
        >
          <View style={styles.tabIconContainer}>
            <Ionicons 
              name="mail" 
              size={20} 
              color={activeTab === 'requests' ? theme.colors.primary : theme.colors.muted} 
            />
            {pendingCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                <Text style={styles.badgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>
          <Text style={[
            styles.tabText,
            { 
              color: activeTab === 'requests' ? theme.colors.primary : theme.colors.muted,
              fontFamily: activeTab === 'requests' ? 'SansationBold' : 'Sansation',
            },
          ]}>
            Pedidos ({pendingCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'friends' ? (
          <FriendsList
            friends={friends}
            onRemoveFriend={handleRemoveFriend}
            onFriendPress={(friend) => {
              // Navegar para perfil do amigo (implementar depois)
              console.log('Ver perfil de:', friend.name);
            }}
          />
        ) : (
          <FriendRequestsList
            requests={receivedRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            loading={loading}
          />
        )}
      </View>

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
    borderBottomWidth: 1,
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  tabIconContainer: {
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'SansationBold',
  },
  content: {
    flex: 1,
  },
});
