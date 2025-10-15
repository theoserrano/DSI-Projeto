import React from "react";
import { ListRenderItem, StyleSheet, Text, View } from "react-native";

import { CustomButton } from "@/components/ui/CustomButton";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { EVENT_GENRES, EVENT_TYPES } from "@/constants/events";
import { useTheme } from "@/context/ThemeContext";
import { ShowEvent } from "@/types/shows";
import { formatEventDateRange } from "@/utils/shows";

type ShowsListProps = {
  data: ShowEvent[];
  activeId: string;
  onSelect: (id: string) => void;
  onEdit: (event: ShowEvent) => void;
  onDelete: (event: ShowEvent) => void;
  canManage: (event: ShowEvent) => boolean;
};

export function ShowsList({ data, activeId, onSelect, onEdit, onDelete, canManage }: ShowsListProps) {
  const theme = useTheme();

  const renderItem: ListRenderItem<ShowEvent> = ({ item }) => {
    const isActive = item.id === activeId;
    const dateLabel = formatEventDateRange(item.startsAt, item.endsAt);
    const typeLabel = EVENT_TYPES.find((type) => type.value === item.eventType)?.label ?? "Evento";
    const genreLabels = item.genres
      .map((genre) => EVENT_GENRES.find((option) => option.value === genre)?.label ?? genre)
      .join(" • ");
    const manage = canManage(item);

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: isActive ? theme.colors.primary : theme.colors.box,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[styles.typePill, { backgroundColor: `${theme.colors.primary}24` }]}
          >
            <Text style={[styles.typePillText, { color: theme.colors.primary }]}>{typeLabel}</Text>
          </View>
          <Text style={[styles.promoter, { color: theme.colors.muted }]}>
            por {item.promoterName}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.primary }]}>{item.title}</Text>
        {item.description ? (
          <Text style={[styles.description, { color: theme.colors.text }]} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <Text style={[styles.meta, { color: theme.colors.muted }]}>
          {item.locationName} • {item.city}
          {item.state ? `, ${item.state}` : ""}
        </Text>

        <Text style={[styles.date, { color: theme.colors.primary }]}>{dateLabel}</Text>
        <Text style={[styles.genres, { color: theme.colors.text }]}>{genreLabels}</Text>

        <View style={styles.actionsRow}>
          <CustomButton
            title={isActive ? "✓ Selecionado" : "Ver no mapa"}
            onPress={() => onSelect(item.id)}
            height={42}
            backgroundColor={isActive ? theme.colors.primary : theme.colors.card}
            textColor={isActive ? "#FFFFFF" : theme.colors.primary}
            style={[styles.buttonFull, { borderColor: theme.colors.primary }]}
          />
        </View>

        {manage ? (
          <View style={styles.manageRow}>
            <CustomButton
              title="Editar"
              onPress={() => onEdit(item)}
              height={38}
              backgroundColor={theme.colors.card}
              textColor={theme.colors.primary}
              style={[styles.buttonHalf, { borderColor: theme.colors.primary }]}
            />
            <CustomButton
              title="Excluir"
              onPress={() => onDelete(item)}
              height={38}
              backgroundColor={theme.colors.card}
              textColor={theme.colors.error}
              style={[styles.buttonHalf, { borderColor: theme.colors.error }]}
            />
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <HorizontalCarousel
      data={data}
      renderItem={renderItem}
      itemWidth={320}
      gap={16}
      style={{ height: 320 }}
      showScroll
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: 18,
    padding: 20,
    borderWidth: 2,
    justifyContent: "space-between",
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  typePillText: {
    fontFamily: "SansationBold",
    fontSize: 12,
    textTransform: "uppercase",
  },
  promoter: {
    fontFamily: "Sansation",
    fontSize: 12,
  },
  title: {
    fontFamily: "SansationBold",
    fontSize: 20,
  },
  description: {
    fontFamily: "Sansation",
    fontSize: 14,
  },
  meta: {
    fontFamily: "Sansation",
    fontSize: 13,
  },
  date: {
    fontFamily: "SansationBold",
    fontSize: 14,
  },
  genres: {
    fontFamily: "Sansation",
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  manageRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  button: {
    borderWidth: 1,
    minWidth: 120,
  },
  buttonFull: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  buttonHalf: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
  },
});
