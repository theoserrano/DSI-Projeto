import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Drawer } from "@/components/ui/Drawer";
import { useTheme } from "@/context/ThemeContext";

type SearchDrawerProps = {
  visible: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchChange: (text: string) => void;
  onClearSearch: () => void;
  recentSearches?: string[];
  onSelectRecent?: (search: string) => void;
};

export function SearchDrawer({
  visible,
  onClose,
  searchValue,
  onSearchChange,
  onClearSearch,
  recentSearches = [],
  onSelectRecent,
}: SearchDrawerProps) {
  const theme = useTheme();

  return (
    <Drawer visible={visible} onClose={onClose} title="Buscar Eventos" heightPercentage={0.75}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Search Input */}
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.muted} style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar por título, local ou cidade..."
            placeholderTextColor={theme.colors.muted}
            value={searchValue}
            onChangeText={onSearchChange}
            style={[styles.searchInput, { color: theme.colors.text }]}
            autoFocus
          />
          {searchValue ? (
            <TouchableOpacity onPress={onClearSearch}>
              <Ionicons name="close-circle" size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Search Tips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Dicas de busca</Text>
          <View style={[styles.tipCard, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="bulb-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.tipText, { color: theme.colors.text }]}>
              Você pode buscar por título do evento, nome do local, cidade ou estado
            </Text>
          </View>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Buscas recentes</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.recentItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => onSelectRecent?.(search)}
              >
                <Ionicons name="time-outline" size={18} color={theme.colors.muted} />
                <Text style={[styles.recentText, { color: theme.colors.text }]}>{search}</Text>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Filters */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Atalhos rápidos</Text>
          <View style={styles.quickFilters}>
            <TouchableOpacity
              style={[styles.quickFilterChip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => onSearchChange("Recife")}
            >
              <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.quickFilterText, { color: theme.colors.text }]}>Recife</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickFilterChip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => onSearchChange("São Paulo")}
            >
              <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.quickFilterText, { color: theme.colors.text }]}>São Paulo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickFilterChip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => onSearchChange("Rio de Janeiro")}
            >
              <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.quickFilterText, { color: theme.colors.text }]}>Rio de Janeiro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Sansation",
    fontSize: 15,
    padding: 0,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "SansationBold",
    fontSize: 16,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontFamily: "Sansation",
    fontSize: 13,
    lineHeight: 18,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  recentText: {
    flex: 1,
    fontFamily: "Sansation",
    fontSize: 14,
  },
  quickFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  quickFilterText: {
    fontFamily: "Sansation",
    fontSize: 13,
  },
});
