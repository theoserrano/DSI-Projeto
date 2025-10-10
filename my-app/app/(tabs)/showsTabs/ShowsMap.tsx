import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { ShowEvent } from "@/types/shows";

type ShowsMapProps = {
  events: ShowEvent[];
  activeId: string;
  onSelect: (id: string) => void;
};

const DEFAULT_REGION: Region = {
  latitude: -14.235004,
  longitude: -51.92528,
  latitudeDelta: 24,
  longitudeDelta: 24,
};

const DETAIL_DELTA = {
  latitudeDelta: 3,
  longitudeDelta: 3,
};

export function ShowsMap({ events, activeId, onSelect }: ShowsMapProps) {
  const theme = useTheme();
  const mapRef = useRef<MapView | null>(null);

  const activeEvent = useMemo(() => events.find((event) => event.id === activeId), [
    events,
    activeId,
  ]);

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
        initialRegion={activeEvent ? {
          latitude: activeEvent.latitude,
          longitude: activeEvent.longitude,
          ...DETAIL_DELTA,
        } : DEFAULT_REGION}
        customMapStyle={theme.mode === "light" ? undefined : darkMapStyle}
        showsCompass={false}
        showsPointsOfInterest={false}
      >
        {events.map((event) => {
          const isActive = event.id === activeId;
          return (
            <Marker
              key={event.id}
              coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              onPress={() => onSelect(event.id)}
              tracksViewChanges={false}
            >
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: isActive ? theme.colors.primary : theme.colors.card,
                    shadowColor: theme.colors.primary + "55",
                  },
                ]}
              >
                <Ionicons
                  name={isActive ? "musical-notes" : "musical-note"}
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={[styles.markerLabel, { color: theme.colors.primary }]}>{event.city}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
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
  },
  map: {
    width: "100%",
    aspectRatio: 1.2,
  },
  marker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 4,
  },
  markerLabel: {
    fontFamily: "SansationBold",
    fontSize: 13,
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
