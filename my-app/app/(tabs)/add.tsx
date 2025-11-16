import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { CustomButton } from "@/components/ui/CustomButton";
import { useRouter } from "expo-router";
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { createPlaylist } from '@/services/playlists';
import { NOTIFICATION_TYPES } from '@/types/notifications';
import { Ionicons } from '@expo/vector-icons';

export default function AddPlaylistScreen() {
  const theme = useTheme();
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();  

  const handleCreate = async () => {
    if (!playlistName.trim()) {
      Alert.alert('Erro', 'Por favor, informe um nome para a playlist.');
      return;
    }

    if (!user || !user.id) {
      Alert.alert('Erro', 'Você precisa estar logado para criar uma playlist.');
      return;
    }

    setIsCreating(true);
    try {
      const newPlaylist = await createPlaylist(
        user.id,
        playlistName.trim(),
        description.trim() || undefined,
        isPublic
      );

      if (newPlaylist) {
        addNotification({
          type: NOTIFICATION_TYPES.GENERAL,
          title: 'Playlist criada!',
          message: `Sua playlist "${newPlaylist.name}" foi criada com sucesso.`,
        });
        
        // Limpa campos e volta para a tela anterior
        setPlaylistName('');
        setDescription('');
        router.back();
      } else {
        Alert.alert('Erro', 'Não foi possível criar a playlist. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar a playlist.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setPlaylistName("");
    setDescription("");
    router.back();
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Icon */}
          <View style={styles.headerIcon}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '15' }]}>
              <Ionicons name="albums" size={64} color={theme.colors.primary} />
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Criar Nova Playlist
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
            Organize suas músicas favoritas em playlists personalizadas
          </Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Nome da Playlist */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Nome da Playlist *
              </Text>
              <TextInput
                placeholder="Ex: Minhas Favoritas"
                placeholderTextColor={theme.colors.muted}
                value={playlistName}
                onChangeText={setPlaylistName}
                style={[
                  styles.input, 
                  { 
                    color: theme.colors.text, 
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  }
                ]}
                maxLength={50}
                autoFocus
              />
              <Text style={[styles.charCount, { color: theme.colors.muted }]}>
                {playlistName.length}/50
              </Text>
            </View>

            {/* Descrição */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Descrição (opcional)
              </Text>
              <TextInput
                placeholder="Adicione uma descrição..."
                placeholderTextColor={theme.colors.muted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={[
                  styles.textArea, 
                  { 
                    color: theme.colors.text, 
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  }
                ]}
                maxLength={200}
                textAlignVertical="top"
              />
              <Text style={[styles.charCount, { color: theme.colors.muted }]}>
                {description.length}/200
              </Text>
            </View>

            {/* Privacidade */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Privacidade
              </Text>
              <View style={styles.privacyOptions}>
                <TouchableOpacity
                  style={[
                    styles.privacyOption,
                    isPublic && styles.privacyOptionActive,
                    { 
                      borderColor: isPublic ? theme.colors.primary : theme.colors.border,
                      backgroundColor: isPublic ? theme.colors.primary + '10' : theme.colors.card,
                    }
                  ]}
                  onPress={() => setIsPublic(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="globe-outline" 
                    size={24} 
                    color={isPublic ? theme.colors.primary : theme.colors.muted} 
                  />
                  <View style={styles.privacyTextContainer}>
                    <Text style={[
                      styles.privacyTitle,
                      { color: isPublic ? theme.colors.primary : theme.colors.text }
                    ]}>
                      Pública
                    </Text>
                    <Text style={[styles.privacySubtitle, { color: theme.colors.muted }]}>
                      Todos podem ver
                    </Text>
                  </View>
                  {isPublic && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.privacyOption,
                    !isPublic && styles.privacyOptionActive,
                    { 
                      borderColor: !isPublic ? theme.colors.primary : theme.colors.border,
                      backgroundColor: !isPublic ? theme.colors.primary + '10' : theme.colors.card,
                    }
                  ]}
                  onPress={() => setIsPublic(false)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={24} 
                    color={!isPublic ? theme.colors.primary : theme.colors.muted} 
                  />
                  <View style={styles.privacyTextContainer}>
                    <Text style={[
                      styles.privacyTitle,
                      { color: !isPublic ? theme.colors.primary : theme.colors.text }
                    ]}>
                      Privada
                    </Text>
                    <Text style={[styles.privacySubtitle, { color: theme.colors.muted }]}>
                      Somente você
                    </Text>
                  </View>
                  {!isPublic && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={[styles.actionsContainer, { borderTopColor: theme.colors.border }]}>
          <CustomButton
            title="Cancelar"
            onPress={handleCancel}
            width="48%"
            height={54}
            backgroundColor={theme.colors.card}
            textColor={theme.colors.text}
            style={{ borderWidth: 1, borderColor: theme.colors.border }}
          />
          <CustomButton
            title={isCreating ? 'Criando...' : 'Criar Playlist'}
            onPress={handleCreate}
            disabled={!playlistName.trim() || isCreating}
            width="48%"
            height={54}
            backgroundColor={theme.colors.primary}
            textColor="#FFFFFF"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerIcon: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'SansationBold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Sansation',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  form: {
    gap: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'SansationBold',
  },
  input: {
    height: 54,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Sansation',
  },
  textArea: {
    minHeight: 120,
    maxHeight: 160,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Sansation',
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Sansation',
    textAlign: 'right',
    marginTop: -4,
  },
  privacyOptions: {
    gap: 12,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 14,
  },
  privacyOptionActive: {
    // Estilo aplicado via borderColor dinâmica
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: 'SansationBold',
    marginBottom: 2,
  },
  privacySubtitle: {
    fontSize: 13,
    fontFamily: 'Sansation',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    gap: 12,
  },
});
