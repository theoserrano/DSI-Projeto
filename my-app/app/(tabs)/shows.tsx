import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ShowsSection } from "./showsTabs/ShowsSection";
import { BOTTOM_NAV_ICONS } from '@/constants/navigation';

export default function ShowsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        >
          <ShowsSection detailNote="Este é um protótipo visual. Informações reais serão adicionadas pelos artistas em breve." />
        </ScrollView>

        <BottomNav tabs={BOTTOM_NAV_ICONS as any} />
      </View>
    </SafeAreaView>
  );
}
