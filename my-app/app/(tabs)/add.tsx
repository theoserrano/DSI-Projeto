import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import InputContainer from "@/components/ui/InputContainer";
import { CustomButton } from "@/components/ui/CustomButton";
import { useRouter } from "expo-router";
import { supabase } from '@/services/supabaseConfig';
import { useAuth } from '@/context/AuthContext';

export default function AddPlaylistScreen() {
  const theme = useTheme();
  const [playlistName, setPlaylistName] = useState("");
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const router = useRouter();  

  const handleCreate = () => {
    createPlaylist();
  };

  const createPlaylist = async () => {
    if (!playlistName.trim()) {
      Alert.alert('Erro', 'Informe um nome para a playlist.');
      return;
    }

    // simple URL validation if provided
    if (imageUrl && imageUrl.trim()) {
      const urlPattern = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
      if (!urlPattern.test(imageUrl.trim())) {
        Alert.alert('Erro', 'Informe um link de imagem válido (começando por http:// ou https://).');
        return;
      }
    }

    if (!user || !user.id) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login antes de criar uma playlist.');
      return;
    }

    try {
      setIsCreating(true);

      const payload = {
        user_id: user.id,
        name: playlistName.trim(),
        description: null,
        image_url: imageUrl && imageUrl.trim() ? imageUrl.trim() : null,
        is_public: false,
      };

      const { data, error } = await supabase.from('playlists').insert([payload]).select();

      if (error) {
        console.error('Supabase insert error', error);
        Alert.alert('Erro', 'Não foi possível criar a playlist.');
        return;
      }

      // Playlist criada com sucesso - redirecionar para home
      setPlaylistName('');
      router.replace('/(tabs)/home');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Ocorreu um erro ao criar a playlist.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setPlaylistName("");
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.label, { color: theme.colors.primary }]}>
        Escreva o nome da playlist
      </Text>
      <InputContainer
        value={playlistName}
        onChangeText={setPlaylistName}
        style={[styles.input, {fontSize: 17}]}
      />
      <View style={styles.buttonRow}>
        <CustomButton title="Cancelar" onPress={handleCancel} style={styles.buttonEmpty} textStyle={{ color: '#0A0F6D' }} />
        <CustomButton title={isCreating ? 'Criando...' : 'Criar'} onPress={handleCreate} style={styles.button} disabled={isCreating} />
  
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  label: {
    fontSize: 28,
    fontFamily: "SansationBold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    color: '#000000ff',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    height: 50,
  },
  buttonEmpty: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0A0F6D',
  },
});
