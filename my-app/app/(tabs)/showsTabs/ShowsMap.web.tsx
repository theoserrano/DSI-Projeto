import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { useTheme } from "@/context/ThemeContext";
import { ShowEvent } from "@/types/shows";

type ShowsMapProps = {
  events: ShowEvent[];
  activeId: string;
  onSelect: (id: string) => void;
  onOpenSearch?: () => void;
  onOpenFilters?: () => void;
  filtersCount?: number;
};

/**
 * Versão web do ShowsMap - react-native-maps não é compatível com web
 * Mostra uma mensagem informativa e os botões de busca/filtros
 */
export function ShowsMap({ onOpenSearch, onOpenFilters, filtersCount }: ShowsMapProps) {
  const theme = useTheme();

  return (
    <View style={[styles.wrapper, { borderColor: theme.colors.primary, backgroundColor: theme.colors.card }]}>
      <View style={styles.content}>
        <Ionicons name="map-outline" size={64} color={theme.colors.muted} />
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Mapa disponível apenas no mobile
        </Text>
        <Text style={[styles.message, { color: theme.colors.muted }]}>
          Use o aplicativo em um dispositivo móvel (iOS/Android) para visualizar o mapa interativo com os eventos.
        </Text>
        <Text style={[styles.hint, { color: theme.colors.muted }]}>
          💡 Você pode usar os filtros e a busca para encontrar eventos específicos abaixo.
        </Text>
      </View>

      {/* Floating Action Buttons */}
      {onOpenSearch && (
        <View style={styles.fabContainer}>
          <FloatingActionButton
            icon="search"
            onPress={onOpenSearch}
            position="bottom-right"
            size={48}
          />
        </View>
      )}
      {onOpenFilters && (
        <View style={[styles.fabContainer, { bottom: 80 }]}>
          <FloatingActionButton
            icon="options"
            onPress={onOpenFilters}
            position="bottom-right"
            size={48}
            badge={filtersCount}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 2,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 20,
    position: "relative",
    aspectRatio: 1.2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 16,
  },
  title: {
    fontFamily: "SansationBold",
    fontSize: 20,
    textAlign: "center",
  },
  message: {
    fontFamily: "Sansation",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  hint: {
    fontFamily: "Sansation",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
  fabContainer: {
    position: "absolute",
  },
});
