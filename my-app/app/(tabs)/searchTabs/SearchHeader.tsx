import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import InputContainer from "@/components/ui/InputContainer";
import { useTheme } from "@/context/ThemeContext";

type SearchHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function SearchHeader({ query, onQueryChange }: SearchHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[
        styles.title, 
        { 
          color: theme.colors.primary,
          fontSize: theme.typography.fontSize.h2,
          fontFamily: theme.typography.fontFamily.bold,
        }
      ]}>Buscar Música</Text>
      <InputContainer
        value={query}
        onChangeText={onQueryChange}
        placeholder="Digite nome, artista ou álbum"
        icon={<Feather name="search" size={20} color={theme.colors.primary} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  title: {
    marginBottom: 20,
  },
});
