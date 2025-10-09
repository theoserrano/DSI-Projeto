import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import InputContainer from "@/components/ui/InputContainer";
import { CustomButton } from "@/components/ui/CustomButton";
import { useRouter } from "expo-router";

export default function AddPlaylistScreen() {
  const theme = useTheme();
  const [playlistName, setPlaylistName] = useState("");
  const router = useRouter();  

  const handleCreate = () => {
    // lógica para criar playlist
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
        <CustomButton title="Criar" onPress={handleCreate} style={styles.buttonEmpty} textStyle={{ color: '#0A0F6D' }} />
        <CustomButton title="Cancelar" onPress={handleCancel} style={styles.button} />
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
