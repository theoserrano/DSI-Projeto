import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
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
  const pathname = usePathname();
  
  const addButtonIndex = tabs.findIndex(
    (tab) => tab.icon === "add-circle" || tab.path.includes("/add")
  );

  const handleTabPress = (path: string, isAddButton: boolean) => {
    // Verifica se já está na rota principal da tab
    const isCurrentTab = pathname.startsWith(path);
    
    if (isAddButton) {
      // Botão Add sempre usa push para abrir modal/tela de criação
      router.push(path as any);
    } else if (isCurrentTab) {
      // Se já está na tab, não faz nada (evita duplicação na pilha)
      return;
    } else {
      // Para outras tabs, usa navigate que é inteligente:
      // - Não duplica se a rota já existe na pilha
      // - Volta para a rota se ela já estava na pilha
      router.navigate(path as any);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={[styles.safeArea, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.container, { 
        backgroundColor: theme.colors.card,
        borderTopColor: theme.colors.primary + '20',
      }]}>
        {tabs.map((tab, index) => {
          const isAddButton = index === addButtonIndex;
          
          // Botão central "Add" destacado
          if (isAddButton) {
            return (
              <View key={index} style={styles.centerButtonWrapper}>
                <TouchableOpacity
                  style={[styles.centerButton, { 
                    backgroundColor: theme.colors.primary,
                    shadowColor: theme.colors.primary,
                  }]}
                  onPress={() => handleTabPress(tab.path, true)}
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
              onPress={() => handleTabPress(tab.path, false)}
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