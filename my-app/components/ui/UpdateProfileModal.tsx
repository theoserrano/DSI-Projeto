
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from './CustomButton';

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
      <View style={styles.overlay}>
        <View style={[styles.drawerContainer, { backgroundColor: theme.colors.card }]}>
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>Editar Perfil</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Photo Section */}
            <View style={styles.photoSection}>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Foto de Perfil</Text>
              <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoContainer}>
                <Image
                  source={photo ? { uri: photo } : require('@/assets/images/icon.png')}
                  style={[styles.photo, { borderColor: theme.colors.primary }]}
                />
                <View style={[styles.cameraIconContainer, { backgroundColor: theme.colors.primary }]}>
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <Text style={[styles.photoHint, { color: theme.colors.muted }]}>
                Toque para alterar a foto
              </Text>
            </View>

            {/* Name Section */}
            <View style={styles.nameSection}>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Nome de Exibição</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.text, 
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  }
                ]}
                onChangeText={setName}
                value={name}
                placeholder="Digite seu nome"
                placeholderTextColor={theme.colors.muted}
                maxLength={50}
              />
              <Text style={[styles.charCount, { color: theme.colors.muted }]}>
                {name.length}/50
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <CustomButton
              title="Cancelar"
              onPress={onClose}
              width="auto"
              height={52}
              backgroundColor={theme.colors.background}
              textColor={theme.colors.text}
              style={[styles.actionButton, { borderWidth: 1, borderColor: theme.colors.border }]}
            />
            <CustomButton
              title="Salvar Alterações"
              onPress={handleSave}
              width="auto"
              height={52}
              backgroundColor={theme.colors.primary}
              textColor="#FFFFFF"
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: 'SansationBold',
    fontSize: 20,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  photoSection: {
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'SansationBold',
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  photoHint: {
    fontSize: 13,
    fontFamily: 'Sansation',
  },
  nameSection: {
    paddingTop: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Sansation',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
