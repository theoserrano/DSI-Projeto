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
 const middleIndex = Math.floor(tabs.length / 2);

  return (
    <SafeAreaView edges={["bottom"]} style={[styles.safeArea]}>
      <View style={styles.container}>
        {tabs.map((tab, index) => {
          // Verifica se é o botão do meio
          if (index === middleIndex) {
            return (
              <TouchableOpacity
                key={index}
                style={styles.middleButton}
                //onPress={() => router.push(tab.path as any)}
                onPress={() => {}}
              >
                <Ionicons name={tab.icon} size={40} color="#0A0F6D" />
              </TouchableOpacity>
            );
          }
          // Renderiza os outros botões
          return (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              //onPress={() => router.push(tab.path as any)}
              onPress={() => {}}
            >
              <Ionicons name={tab.icon} size={30} color="#0A0F6D" />
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
    backgroundColor: '#D8E9FF'
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
    backgroundColor: '#D8E9FF'
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D8E9FF',
    borderColor: '#0A0F6D',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Remova ou reduza o marginBottom:
    marginBottom: 5,
    shadowColor: '#0A0F6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});