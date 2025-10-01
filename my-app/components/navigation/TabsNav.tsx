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
    <View style={[styles.tabsContainer, { backgroundColor: theme?.colors.background, borderColor: theme?.colors.primary }]}>
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.key;
        return (
          <React.Fragment key={tab.key}>
            <TouchableOpacity
              style={[styles.tabButton, isActive && { backgroundColor: theme?.colors.primary + "22" }]}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? theme?.colors.primary : theme?.colors.muted,
                    fontWeight: isActive ? "bold" : "500",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
            {idx < tabs.length - 1 && (
              <View style={[styles.separator, { backgroundColor: theme?.colors.primary + "55" }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    overflow: "hidden",
    margin: 8,
    height: 40,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  tabText: {
    fontSize: 16,
    textAlign: "center",
  },
  separator: {
    width: 2,
    height: "60%",
    alignSelf: "center",
    borderRadius: 1,
  },
});
