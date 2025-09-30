import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type TabItem = {
  key: string;
  label: string;
};

type TabsHeaderProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
};

export function TabsHeader({ tabs, activeTab, onTabPress }: TabsHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity key={tab.key} onPress={() => onTabPress(tab.key)}>
            <Text
              style={[
                styles.tabText,
                {
                  color: isActive ? theme.colors.primary : theme.colors.muted,
                  fontWeight: isActive ? "bold" : "500",
                },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && (
              <View
                style={[
                  styles.activeTabIndicator,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginTop: 8,
  },
  tabText: {
    fontSize: 18,
    textAlign: "center",
  },
  activeTabIndicator: {
    height: 3,
    width: "100%",
    marginTop: 6,
    borderRadius: 2,
  },
});