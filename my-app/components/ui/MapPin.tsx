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
  const baseColor = active ? highlight : "#FF3B30";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pin,
          {
            backgroundColor: baseColor,
            shadowColor: baseColor + "66",
          },
        ]}
      >
        <Ionicons name={active ? "musical-notes" : "musical-note"} size={16} color="#FFFFFF" />
      </View>
      <View
        style={[
          styles.tail,
          {
            borderTopColor: baseColor,
          },
        ]}
      />
      {label ? (
        <View style={[styles.badge, { backgroundColor: theme.colors.card, borderColor: baseColor }]}
        >
          <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 6,
  },
  label: {
    fontFamily: "SansationBold",
    fontSize: 12,
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderRightWidth: 8,
    borderLeftWidth: 8,
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
});
