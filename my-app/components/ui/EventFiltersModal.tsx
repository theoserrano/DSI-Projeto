import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";

import { CustomButton } from "@/components/ui/CustomButton";
import { EVENT_GENRES, EVENT_TYPES } from "@/constants/events";
import { useTheme } from "@/context/ThemeContext";
import { EventGenre, EventType } from "@/types/shows";

type EventFiltersState = {
  search: string;
  types: EventType[];
  genres: EventGenre[];
  showOnlyMine: boolean;
  includePast: boolean;
};

type EventFiltersModalProps = {
  visible: boolean;
  filters: EventFiltersState;
  onApply: (filters: EventFiltersState) => void;
  onReset: () => void;
  onClose: () => void;
};

export function EventFiltersModal({
  visible,
  filters,
  onApply,
  onReset,
  onClose,
}: EventFiltersModalProps) {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<EventFiltersState>(filters);

  // Sincroniza local filters quando o modal abre
  React.useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  const toggleType = (type: EventType) => {
    setLocalFilters((prev) => {
      const exists = prev.types.includes(type);
      return {
        ...prev,
        types: exists ? prev.types.filter((item) => item !== type) : [...prev.types, type],
      };
    });
  };

  const toggleGenre = (genre: EventGenre) => {
    setLocalFilters((prev) => {
      const exists = prev.genres.includes(genre);
      return {
        ...prev,
        genres: exists ? prev.genres.filter((item) => item !== genre) : [...prev.genres, genre],
      };
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  const activeFiltersCount =
    localFilters.types.length +
    localFilters.genres.length +
    (localFilters.search.trim().length > 0 ? 1 : 0) +
    (localFilters.showOnlyMine ? 1 : 0) +
    (localFilters.includePast ? 1 : 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>Filtros</Text>
            {activeFiltersCount > 0 ? (
              <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.badgeText}>{activeFiltersCount}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.scrollWrapper}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
            <Text style={[styles.sectionLabel, { color: theme.colors.muted }]}>Buscar</Text>
            <TextInput
              style={[
                styles.searchInput,
                { borderColor: theme.colors.box, color: theme.colors.text },
              ]}
              placeholder="Título, local, cidade ou artista"
              placeholderTextColor="#9AA0B4"
              value={localFilters.search}
              onChangeText={(text) => setLocalFilters((prev) => ({ ...prev, search: text }))}
            />

            <Text style={[styles.sectionLabel, { color: theme.colors.muted }]}>Tipo de Evento</Text>
            <View style={styles.chipsWrap}>
              {EVENT_TYPES.map((type) => {
                const selected = localFilters.types.includes(type.value);
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? theme.colors.primary : "transparent",
                        borderColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => toggleType(type.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: selected ? "#FFFFFF" : theme.colors.primary },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.sectionLabel, { color: theme.colors.muted }]}>Gêneros Musicais</Text>
            <View style={styles.chipsWrap}>
              {EVENT_GENRES.map((genre) => {
                const selected = localFilters.genres.includes(genre.value);
                return (
                  <TouchableOpacity
                    key={genre.value}
                    style={[
                      styles.genreChip,
                      {
                        backgroundColor: selected ? genre.color : "transparent",
                        borderColor: genre.color,
                      },
                    ]}
                    onPress={() => toggleGenre(genre.value)}
                  >
                    <Text
                      style={[
                        styles.genreChipText,
                        { color: selected ? "#FFFFFF" : genre.color },
                      ]}
                    >
                      {genre.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.sectionLabel, { color: theme.colors.muted }]}>Opções</Text>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
                  Somente meus eventos
                </Text>
                <Switch
                  value={localFilters.showOnlyMine}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({ ...prev, showOnlyMine: value }))
                  }
                  trackColor={{ false: theme.colors.box, true: theme.colors.primary }}
                />
              </View>
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
                  Incluir eventos passados
                </Text>
                <Switch
                  value={localFilters.includePast}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({ ...prev, includePast: value }))
                  }
                  trackColor={{ false: theme.colors.box, true: theme.colors.primary }}
                />
              </View>
            </View>
          </ScrollView>
          </View>

          <View style={styles.actions}>
            <CustomButton
              title="Limpar"
              onPress={handleReset}
              width="auto"
              height={48}
              backgroundColor={theme.colors.card}
              textColor={theme.colors.muted}
              style={[styles.actionButton, { borderWidth: 1, borderColor: theme.colors.box }]}
            />
            <CustomButton
              title="Aplicar"
              onPress={handleApply}
              width="auto"
              height={48}
              backgroundColor={theme.colors.primary}
              textColor="#FFFFFF"
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontFamily: "SansationBold",
    fontSize: 24,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    fontFamily: "SansationBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  scrollWrapper: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionLabel: {
    fontFamily: "SansationBold",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: "Sansation",
    fontSize: 15,
    backgroundColor: "#FFFFFF",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipText: {
    fontFamily: "SansationBold",
    fontSize: 13,
  },
  genreChip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  genreChipText: {
    fontFamily: "Sansation",
    fontSize: 13,
  },
  toggleContainer: {
    gap: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  toggleLabel: {
    fontFamily: "Sansation",
    fontSize: 15,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
  },
});
