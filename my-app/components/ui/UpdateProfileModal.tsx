
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // This line is correct and should not be changed.

interface UpdateProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, photo: string | null) => void;
  currentName: string;
  currentPhoto: string | null;
}

export const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  currentName,
  currentPhoto,
}) => {
  const theme = useTheme();
  const [name, setName] = useState(currentName);
  const [photo, setPhoto] = useState<string | null>(currentPhoto);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    onSave(name, photo);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary }]}>
          <Text style={[styles.modalText, { color: theme.colors.text }]}>Editar Perfil</Text>

          <TouchableOpacity onPress={handleChoosePhoto}>
            <Image
              source={photo ? { uri: photo } : require('@/assets/images/icon.png')}
              style={[styles.photo, { borderColor: theme.colors.primary }]}
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={24} color={theme.colors.primary} />
            </View>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.primary }]}
            onChangeText={setName}
            value={name}
            placeholder="Nome"
            placeholderTextColor={theme.colors.text}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.textStyle}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.box, borderWidth: 1, borderColor: theme.colors.primary }]}
              onPress={onClose}
            >
              <Text style={[styles.textStyle, { color: theme.colors.primary }]}>Cancelar</Text>
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'SansationBold',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    marginBottom: 20,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
  },
  input: {
    width: 200,
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '48%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
