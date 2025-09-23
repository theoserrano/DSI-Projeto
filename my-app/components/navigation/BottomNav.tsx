import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type TabItem = {
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
};

type BottomNavProps = {
  tabs: TabItem[];
};

export function BottomNav({ tabs }: BottomNavProps) {
  const router = useRouter();
  const middleIndex = Math.floor(tabs.length / 2);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        {tabs.map((tab, index) => {
          // Verifica se é o botão do meio
          if (index === middleIndex) {
            return (
              <TouchableOpacity
                key={index}
                style={styles.middleButton}
                onPress={() => router.push(tab.path as any)}
              >
                <Ionicons name={tab.icon} size={40} color="white" />
              </TouchableOpacity>
            );
          }
          // Renderiza os outros botões
          return (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              onPress={() => router.push(tab.path as any)}
            >
              <Ionicons name={tab.icon} size={30} color="#A9A9A9" />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: "#0B0F45", // Fundo escuro
    borderTopWidth: 1,
    borderTopColor: '#2a2d5c'
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3865FF', // Azul destacado
    justifyContent: 'center',
    alignItems: 'center',
    // Efeito para "flutuar" um pouco acima
    marginBottom: 25,
    shadowColor: '#3865FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});