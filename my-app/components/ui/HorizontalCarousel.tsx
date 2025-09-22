import React from "react";
import { FlatList, ListRenderItem, StyleProp, ViewStyle } from "react-native";

type HorizontalCarouselProps<T> = {
  data: T[];
  renderItem: ListRenderItem<T>;
  itemWidth?: number; // opcional: largura do item, útil pra snapping
  gap?: number;       // opcional: espaço entre itens
  showScroll?: boolean; // se quer mostrar indicador de scroll
  style?: StyleProp<ViewStyle>;
};

export function HorizontalCarousel<T>({
  data,
  renderItem,
  itemWidth,
  gap = 5,
  showScroll = false,
  style,
}: HorizontalCarouselProps<T>) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item: any) => item.id}
      horizontal
      showsHorizontalScrollIndicator={showScroll}
      renderItem={renderItem}
      contentContainerStyle={{ paddingHorizontal: 16, gap }}
      // Snapping opcional
      snapToInterval={itemWidth ? itemWidth + gap : undefined}
      decelerationRate={itemWidth ? "fast" : undefined}
      style={style}
    />
  );
}
