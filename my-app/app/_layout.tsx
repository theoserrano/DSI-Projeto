import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";

// Impede que a splash screen feche automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Carregar suas fontes personalizadas
  const [fontsLoaded] = useFonts({
    Sansation: require("../assets/fonts/Sansation-Regular.ttf"),
    SansationBold: require("../assets/fonts/Sansation-Bold.ttf"),
  });

  // Esconde a splash quando as fontes carregarem
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Enquanto não carregar, não renderiza nada (fica na splash)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
