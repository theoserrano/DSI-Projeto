import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../services/firebaseConfig';
type HeaderProps = {
  onPressFriends?: () => void;
  userImage?: string; // opcional
};

export const Header: React.FC<HeaderProps> = ({ onPressFriends, userImage }) => {

  const { user } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O AuthProvider cuidará do redirecionamento.
      // Usar Alert.alert é mais consistente com o resto do app.
      Alert.alert("Logout", "Você saiu da sua conta.");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  };


  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.userCircle} onPress={handleLogout}>
        {userImage ? (
          <Image source={{ uri: userImage }} style={styles.userImage} />
        ) : null}
      </TouchableOpacity>

      <TouchableOpacity style={styles.friendsButton} onPress={onPressFriends}>
        <Text>Amigos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  friendsButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userCircle: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
});
