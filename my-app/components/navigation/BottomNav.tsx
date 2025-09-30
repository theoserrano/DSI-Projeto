import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";


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
                //onPress={() => router.push(tab.path as any)}
                onPress={() => {}}
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
              //onPress={() => router.push(tab.path as any)}
              onPress={() => {}}
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
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // right: 0,
    backgroundColor: Colors.primaryColor,
    // paddingBottom: 0, // Garante que não há padding extra
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
    paddingVertical: 5, // Reduzido para aproximar da borda inferior
    backgroundColor: Colors.primaryColor,
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
    backgroundColor: '#3865FF',
    justifyContent: 'center',
    alignItems: 'center',
    // Remova ou reduza o marginBottom:
    marginBottom: 5,
    shadowColor: '#3865FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});