import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

type HeaderProps = {
  onPressUser?: () => void;
  onPressFriends?: () => void;
  userImage?: string; // opcional
};

export const Header: React.FC<HeaderProps> = ({ onPressUser, onPressFriends, userImage }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.userCircle} onPress={onPressUser}>
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
