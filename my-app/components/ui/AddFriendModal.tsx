import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from './CustomButton';

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
      <View style={styles.overlay}>
        <View style={[styles.drawerContainer, { backgroundColor: theme.colors.card }]}>
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
              Adicionar Amigo
            </Text>
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
            <View style={styles.infoSection}>
              <Ionicons name="person-add" size={48} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                Envie uma solicitação de amizade
              </Text>
              <Text style={[styles.infoSubtext, { color: theme.colors.muted }]}>
                Digite o nome do usuário que você deseja adicionar como amigo
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                Nome do Amigo
              </Text>
              <TextInput
                placeholder="Digite o nome de usuário..."
                placeholderTextColor={theme.colors.muted}
                value={friendName}
                onChangeText={setFriendName}
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.text, 
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  }
                ]}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 20 }]}>
                Mensagem (opcional)
              </Text>
              <TextInput
                placeholder="Adicione uma mensagem..."
                placeholderTextColor={theme.colors.muted}
                value={message}
                onChangeText={setMessage}
                multiline
                style={[
                  styles.messageInput, 
                  { 
                    color: theme.colors.text, 
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  }
                ]}
                maxLength={200}
                textAlignVertical="top"
              />
              <Text style={[styles.charCount, { color: theme.colors.muted }]}>
                {message.length}/200
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
              title="Enviar Solicitação"
              onPress={handleAdd}
              disabled={!friendName.trim()}
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
    height: '75%',
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
  infoSection: {
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'SansationBold',
    marginTop: 12,
    textAlign: 'center',
  },
  infoSubtext: {
    fontSize: 14,
    fontFamily: 'Sansation',
    marginTop: 8,
    textAlign: 'center',
  },
  formSection: {
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'SansationBold',
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Sansation',
  },
  messageInput: {
    minHeight: 100,
    maxHeight: 150,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
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
