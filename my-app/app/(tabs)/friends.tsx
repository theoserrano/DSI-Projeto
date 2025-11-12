import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFriends } from '@/hooks/useFriends';
import { FriendsList } from '@/components/ui/FriendsList';
import { AddFriendModal } from '@/components/ui/AddFriendModal';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function FriendsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [addModalVisible, setAddModalVisible] = useState(false);

  const {
    friends,
    sendFriendRequest,
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { 
          color: theme.colors.primary,
          fontFamily: 'SansationBold',
        }]}>
          Meus Amigos
        </Text>
        <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.addButton}>
          <Ionicons name="person-add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FriendsList
          friends={friends}
          onRemoveFriend={handleRemoveFriend}
          onFriendPress={(friend) => {
            // Navegar para perfil do amigo (implementar depois)
            console.log('Ver perfil de:', friend.name);
          }}
        />
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
});
