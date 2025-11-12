import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { DEFAULT_EVENT_PIN_COLOR, GENRE_COLOR_MAP } from "@/constants/events";
import { useTheme } from "@/context/ThemeContext";
import { ShowEvent } from "@/types/shows";
// Using native Marker pins to avoid clipping/anchor issues across platforms

type ShowsMapProps = {
  events: ShowEvent[];
  activeId: string;
  onSelect: (id: string) => void;
  onOpenSearch?: () => void;
  onOpenFilters?: () => void;
  filtersCount?: number;
};

const DEFAULT_REGION: Region = {
  latitude: -14.235004,
  longitude: -51.92528,
  latitudeDelta: 24,
  longitudeDelta: 24,
};

const DETAIL_DELTA: Pick<Region, "latitudeDelta" | "longitudeDelta"> = {
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export function ShowsMap({ events, activeId, onSelect, onOpenSearch, onOpenFilters, filtersCount }: ShowsMapProps) {
  const theme = useTheme();
  const mapRef = useRef<MapView | null>(null);

  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeId),
    [events, activeId]
  );

  useEffect(() => {
    if (mapRef.current && activeEvent) {
      mapRef.current.animateToRegion(
        {
          latitude: activeEvent.latitude,
          longitude: activeEvent.longitude,
          ...DETAIL_DELTA,
        },
        500
      );
    }
  }, [activeEvent]);

  return (
    <View style={[styles.wrapper, { borderColor: theme.colors.primary }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={
          activeEvent
            ? {
                latitude: activeEvent.latitude,
                longitude: activeEvent.longitude,
                ...DETAIL_DELTA,
              }
            : DEFAULT_REGION
        }
        customMapStyle={theme.mode === "light" ? undefined : darkMapStyle}
        showsCompass={false}
        showsPointsOfInterest={false}
      >
        {events.map((event) => {
          const isActive = event.id === activeId;
          const primaryGenre = event.genres[0];
          const genreColor = primaryGenre ? GENRE_COLOR_MAP[primaryGenre] : DEFAULT_EVENT_PIN_COLOR;
          const pinColor = isActive ? theme.colors.primary : genreColor ?? DEFAULT_EVENT_PIN_COLOR;

          return (
            <Marker
              key={event.id}
              coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              onPress={() => onSelect(event.id)}
              tracksViewChanges={false}
              pinColor={pinColor}
              anchor={{ x: 0.5, y: 1 }}
              stopPropagation={false}
            />
          );
        })}
      </MapView>

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
  },
  map: {
    width: "100%",
    aspectRatio: 1.2,
  },
  fabContainer: {
    position: "absolute",
  },
});

const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1d2c4d" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8ec3b9" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1a3646" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4b6878" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334e87" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#283d6a" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6f9ba5" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#023e58" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#304a7d" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#98a5be" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2c6675" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e6d70" }],
  },
];
