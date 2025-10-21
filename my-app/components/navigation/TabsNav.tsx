import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function TabsHeader({ tabs, activeTab, onTabPress }: TabsHeaderProps) {
  const theme = useTheme();
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const activeIndex = tabs.findIndex(tab => tab.key === activeTab);

  useEffect(() => {
    if (tabLayouts[activeTab]) {
      // Anima o deslizamento horizontal
      Animated.spring(slideAnim, {
        toValue: tabLayouts[activeTab].x,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      // Anima um pequeno "pulso" ao trocar
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeTab, tabLayouts]);

  const handleTabPress = (key: string) => {
    onTabPress(key);
  };

  const handleLayout = (key: string, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => ({
      ...prev,
      [key]: { x, width }
    }));
  };

  const activeWidth = tabLayouts[activeTab]?.width || 80;

  return (
    <View style={[styles.tabsContainer, { backgroundColor: theme?.colors.background }]}>
      <View style={styles.tabsWrapper}>
        {/* Indicador animado de fundo */}
        {tabLayouts[activeTab] && (
          <Animated.View
            style={[
              styles.slidingIndicator,
              {
                backgroundColor: theme?.colors.primary,
                width: activeWidth,
                transform: [
                  { translateX: slideAnim },
                  { scale: scaleAnim }
                ],
              },
            ]}
          />
        )}

        {/* Abas */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}
              onLayout={(e) => handleLayout(tab.key, e)}
            >
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? '#FFFFFF' : theme?.colors.muted,
                      fontFamily: isActive ? 'SansationBold' : 'Sansation',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  tabsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
    gap: 6,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    zIndex: 2,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 13,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  slidingIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 20,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
