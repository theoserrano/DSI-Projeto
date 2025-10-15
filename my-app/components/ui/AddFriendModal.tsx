import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface AddFriendModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (friendName: string, message: string) => void;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({ visible, onClose, onAdd }) => {
  const theme = useTheme();
  const [friendName, setFriendName] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = () => {
    if (!friendName.trim()) return;
    onAdd(friendName.trim(), message.trim());
    setFriendName('');
    setMessage('');
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary }]}>
          <Text style={[
            styles.title, 
            { 
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.xxl,
              fontFamily: theme.typography.fontFamily.bold,
            }
          ]}>Adicionar Amigo</Text>

          <TextInput
            placeholder="Nome do amigo"
            placeholderTextColor={theme.colors.text}
            value={friendName}
            onChangeText={setFriendName}
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.primary }]}
          />


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleAdd}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.box, borderWidth: 1, borderColor: theme.colors.primary }]} onPress={onClose}>
              <Text style={[styles.buttonText, { color: theme.colors.primary }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  title: {
    marginBottom: 10,
  },
  input: {
    width: 240,
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
