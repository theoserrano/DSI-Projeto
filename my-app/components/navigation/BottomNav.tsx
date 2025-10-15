import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";


type TabItem = {
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
};

type BottomNavProps = {
  tabs: TabItem[];
};

export function BottomNav({ tabs }: BottomNavProps) {
  const theme = useTheme();

  const router = useRouter();
  const floatingIndex = tabs.findIndex(
    (tab) => tab.icon === "add-circle" || tab.path.includes("/add")
  );
  const middleIndex = floatingIndex >= 0 ? floatingIndex : Math.floor(tabs.length / 2);

  return (
    <SafeAreaView edges={["bottom"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
        {tabs.map((tab, index) => {
          // Verifica se é o botão do meio
          if (index === middleIndex) {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.middleButton, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push(tab.path as any)}
              >
                <Ionicons name={tab.icon} size={40} color={theme.colors.primary} />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              onPress={() => router.push(tab.path as any)}
            >
              <Ionicons name={tab.icon} size={30} color={theme.colors.primary} />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});