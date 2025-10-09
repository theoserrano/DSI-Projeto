import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type ShowsSectionProps = {
  message?: string;
};

export function ShowsSection({ message = "Shows recomendados em breve" }: ShowsSectionProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>Shows</Text>
      <View style={[styles.box, { borderColor: theme.colors.primary }]}
      >
        <Text style={[styles.message, { color: theme.colors.muted }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  box: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    backgroundColor: "#F6FBFF",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
  },
});
