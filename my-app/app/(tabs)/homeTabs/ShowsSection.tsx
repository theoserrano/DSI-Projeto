import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { ShowsMap } from "../showsTabs/ShowsMap";
import { ShowsList } from "../showsTabs/ShowsList";
import { UPCOMING_SHOWS } from "@/constants/shows";
import { ShowEvent } from "@/types/shows";

type ShowsSectionProps = {
  shows?: ShowEvent[];
  title?: string;
  subtitle?: string;
  detailNote?: string;
};

export function ShowsSection({
  shows = UPCOMING_SHOWS,
  title = "Mapa de Shows",
  subtitle = "Visualize os pontos que os artistas estão planejando para novas apresentações.",
  detailNote = "Este é um protótipo visual. Informações reais serão adicionadas pelos artistas em breve.",
}: ShowsSectionProps) {
  const theme = useTheme();
  const [selectedShowId, setSelectedShowId] = useState(shows[0]?.id ?? "");

  const selectedShow = useMemo(
    () => shows.find((item) => item.id === selectedShowId),
    [shows, selectedShowId]
  );

  if (!shows.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: theme.colors.primary }]}>Nenhum show disponível</Text>
        <Text style={[styles.emptyMessage, { color: theme.colors.muted }]}
        >Os artistas começarão a compartilhar apresentações em breve.</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{subtitle}</Text>
        ) : null}
      </View>

      <ShowsMap events={shows} activeId={selectedShowId} onSelect={setSelectedShowId} />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Próximos eventos</Text>
        <Text style={[styles.sectionHint, { color: theme.colors.muted }]}>Toque em um cartão para destacar no mapa.</Text>
      </View>

      <ShowsList data={shows} activeId={selectedShowId} onSelect={setSelectedShowId} />

      {selectedShow && (
        <View
          style={[styles.detailsCard, {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.primary,
          }]}
        >
          <Text style={[styles.detailsTitle, { color: theme.colors.primary }]}>{selectedShow.title}</Text>
          <Text style={[styles.detailsArtist, { color: theme.colors.text }]}>{selectedShow.artist}</Text>
          <Text style={[styles.detailsMeta, { color: theme.colors.muted }]}>
            {selectedShow.venue} • {selectedShow.city}
          </Text>
          <Text style={[styles.detailsDate, { color: theme.colors.primary }]}>{selectedShow.date}</Text>
          {detailNote ? (
            <Text style={[styles.detailsFootnote, { color: theme.colors.muted }]}>{detailNote}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    marginTop: 30,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: "SansationBold",
    fontSize: 20,
  },
  emptyMessage: {
    fontFamily: "Sansation",
    fontSize: 14,
    lineHeight: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 8,
  },
  title: {
    fontFamily: "SansationBold",
    fontSize: 28,
  },
  subtitle: {
    fontFamily: "Sansation",
    fontSize: 15,
    lineHeight: 20,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginTop: 12,
    gap: 4,
  },
  sectionTitle: {
    fontFamily: "SansationBold",
    fontSize: 20,
  },
  sectionHint: {
    fontFamily: "Sansation",
    fontSize: 14,
  },
  detailsCard: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    borderRadius: 18,
    borderWidth: 2,
    gap: 6,
  },
  detailsTitle: {
    fontFamily: "SansationBold",
    fontSize: 20,
  },
  detailsArtist: {
    fontFamily: "Sansation",
    fontSize: 18,
  },
  detailsMeta: {
    fontFamily: "Sansation",
    fontSize: 15,
  },
  detailsDate: {
    fontFamily: "SansationBold",
    fontSize: 16,
    marginTop: 4,
  },
  detailsFootnote: {
    fontFamily: "Sansation",
    fontSize: 12,
    marginTop: 8,
  },
});
