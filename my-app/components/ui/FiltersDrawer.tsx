import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { CustomButton } from "@/components/ui/CustomButton";
import { Drawer } from "@/components/ui/Drawer";
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

type FiltersDrawerProps = {
  visible: boolean;
  filters: EventFiltersState;
  onApply: (filters: EventFiltersState) => void;
  onReset: () => void;
  onClose: () => void;
};

export function FiltersDrawer({
  visible,
  filters,
  onApply,
  onReset,
  onClose,
}: FiltersDrawerProps) {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<EventFiltersState>(filters);

  // Sincroniza filtros locais quando o drawer abre
  useEffect(() => {
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
    (localFilters.showOnlyMine ? 1 : 0) +
    (localFilters.includePast ? 1 : 0);

  return (
    <Drawer visible={visible} onClose={onClose} title="Filtros" heightPercentage={0.8}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Active Filters Badge */}
        {activeFiltersCount > 0 && (
          <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.badgeText}>{activeFiltersCount} filtro(s) ativo(s)</Text>
          </View>
        )}

        {/* Event Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Tipo de Evento</Text>
          <View style={styles.chipsContainer}>
            {EVENT_TYPES.map((type) => {
              const isSelected = localFilters.types.includes(type.value);
              return (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.card,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => toggleType(type.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? "#FFFFFF" : theme.colors.text },
                    ]}
                  >
                    {type.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Genres */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Gêneros Musicais</Text>
          <View style={styles.chipsContainer}>
            {EVENT_GENRES.map((genre) => {
              const isSelected = localFilters.genres.includes(genre.value);
              return (
                <TouchableOpacity
                  key={genre.value}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? genre.color : theme.colors.card,
                      borderColor: isSelected ? genre.color : theme.colors.border,
                    },
                  ]}
                  onPress={() => toggleGenre(genre.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? "#FFFFFF" : theme.colors.text },
                    ]}
                  >
                    {genre.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Toggle Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Opções</Text>

          <View style={[styles.switchRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.switchLabel}>
              <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.switchText, { color: theme.colors.text }]}>
                Apenas meus eventos
              </Text>
            </View>
            <Switch
              value={localFilters.showOnlyMine}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, showOnlyMine: value }))
              }
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.switchText, { color: theme.colors.text }]}>
                Incluir eventos passados
              </Text>
            </View>
            <Switch
              value={localFilters.includePast}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, includePast: value }))
              }
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <CustomButton
            title="Limpar Filtros"
            onPress={handleReset}
            width="48%"
            height={48}
            backgroundColor={theme.colors.card}
            textColor={theme.colors.muted}
            style={{ borderWidth: 1, borderColor: theme.colors.border }}
          />
          <CustomButton
            title="Aplicar"
            onPress={handleApply}
            width="48%"
            height={48}
            backgroundColor={theme.colors.primary}
            textColor="#FFFFFF"
          />
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
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: "SansationBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "SansationBold",
    fontSize: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontFamily: "Sansation",
    fontSize: 14,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  switchText: {
    fontFamily: "Sansation",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
    paddingBottom: 20,
  },
});
