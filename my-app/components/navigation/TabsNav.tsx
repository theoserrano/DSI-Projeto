import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.key} onPress={() => onTabPress(tab.key)}>
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
          {activeTab === tab.key && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center", // centraliza no meio da tela
    gap: 40, // espaço entre as tabs
    marginTop: 8,
  },
  tabText: {
    color: "#888",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  activeTabText: {
    color: "#3865FF",
    fontWeight: "bold",
  },
  activeTabIndicator: {
    height: 3,
    width: "100%",
    backgroundColor: "#3865FF",
    marginTop: 6,
    borderRadius: 2,
  },
});
