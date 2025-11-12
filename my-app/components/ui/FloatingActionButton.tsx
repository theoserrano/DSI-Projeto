import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "@/context/ThemeContext";

type FloatingActionButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  position?: "bottom-left" | "bottom-right" | "top-right" | "top-left";
  size?: number;
  badge?: number;
};

export function FloatingActionButton({
  icon,
  onPress,
  position = "bottom-right",
  size = 56,
  badge,
}: FloatingActionButtonProps) {
  const theme = useTheme();

  const positionStyle = {
    "bottom-right": { bottom: 20, right: 20 },
    "bottom-left": { bottom: 20, left: 20 },
    "top-right": { top: 20, right: 20 },
    "top-left": { top: 20, left: 20 },
  }[position];

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          backgroundColor: theme.colors.primary,
          width: size,
          height: size,
          borderRadius: size / 2,
          ...positionStyle,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={size * 0.5} color="#FFFFFF" />
      {badge !== undefined && badge > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
          {/* Badge text placeholder - você pode adicionar um Text aqui se quiser mostrar o número */}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
