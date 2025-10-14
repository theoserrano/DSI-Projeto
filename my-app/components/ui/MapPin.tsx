import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";

type MapPinProps = {
  label?: string;
  active?: boolean;
};

export function MapPin({ label, active = false }: MapPinProps) {
  const theme = useTheme();

  const highlight = theme.colors.primary;
  const inactive = "#F24F4F";
  const pinColor = active ? highlight : inactive;
  const badgeText = active ? highlight : theme.colors.muted;

  return (
    <View style={styles.container}>
      <View style={styles.pinWrapper}>
        {active ? <View style={[styles.pulse, { borderColor: pinColor + "55" }]} /> : null}
        <Ionicons
          name={active ? "location-sharp" : "location-outline"}
          size={active ? 38 : 34}
          color={pinColor}
          style={styles.pinIcon}
        />
        <View style={[styles.pinCore, { backgroundColor: theme.colors.background }]} />
      </View>
      {label ? (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.card,
              borderColor: pinColor,
              shadowColor: pinColor + "22",
            },
          ]}
        >
          <Text style={[styles.label, { color: badgeText }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  pinWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    opacity: 0.65,
  },
  pinIcon: {
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pinCore: {
    position: "absolute",
    bottom: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontFamily: "SansationBold",
    fontSize: 11,
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
});
