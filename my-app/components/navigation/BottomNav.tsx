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
  
  const addButtonIndex = tabs.findIndex(
    (tab) => tab.icon === "add-circle" || tab.path.includes("/add")
  );

  return (
    <SafeAreaView edges={["bottom"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { 
        backgroundColor: theme.colors.card,
        borderTopColor: theme.colors.primary + '20',
      }]}>
        {tabs.map((tab, index) => {
          // Botão central "Add" destacado
          if (index === addButtonIndex) {
            return (
              <View key={index} style={styles.centerButtonWrapper}>
                <TouchableOpacity
                  style={[styles.centerButton, { 
                    backgroundColor: theme.colors.primary,
                    shadowColor: theme.colors.primary,
                  }]}
                  onPress={() => router.push(tab.path as any)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
            );
          }
          
          // Botões normais
          return (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              onPress={() => router.push(tab.path as any)}
              activeOpacity={0.6}
            >
              <Ionicons name={tab.icon} size={26} color={theme.colors.text} />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: "row",
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});