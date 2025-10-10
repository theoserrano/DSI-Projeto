import React from "react";
import { ListRenderItem, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { CustomButton } from "@/components/ui/CustomButton";
import { ShowEvent } from "@/types/shows";

type ShowsListProps = {
  data: ShowEvent[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function ShowsList({ data, activeId, onSelect }: ShowsListProps) {
  const theme = useTheme();

  const renderItem: ListRenderItem<ShowEvent> = ({ item }) => {
    const isActive = item.id === activeId;

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
        <Text style={[styles.title, { color: theme.colors.primary }]}>{item.title}</Text>
        <Text style={[styles.artist, { color: theme.colors.text }]}>{item.artist}</Text>
        <Text style={[styles.meta, { color: theme.colors.muted }]}>
          {item.venue} • {item.city}
        </Text>
        <Text style={[styles.date, { color: theme.colors.primary }]}>{item.date}</Text>
        <CustomButton
          title={isActive ? "Selecionado" : "Ver no mapa"}
          onPress={() => onSelect(item.id)}
          height={44}
          backgroundColor={isActive ? theme.colors.primary : theme.colors.card}
          textColor={isActive ? "#FFFFFF" : theme.colors.primary}
          style={styles.button}
        />
      </View>
    );
  };

  return (
    <HorizontalCarousel
      data={data}
      renderItem={renderItem}
      itemWidth={240}
      gap={16}
      style={{ height: 220 }}
      showScroll
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "SansationBold",
    fontSize: 18,
    marginBottom: 4,
  },
  artist: {
    fontFamily: "Sansation",
    fontSize: 16,
    marginBottom: 4,
  },
  meta: {
    fontFamily: "Sansation",
    fontSize: 14,
    marginBottom: 8,
  },
  date: {
    fontFamily: "SansationBold",
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    borderWidth: 1,
  },
});
