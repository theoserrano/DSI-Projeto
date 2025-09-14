import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Importa o componente de Splash customizado
import CustomSplashScreen from './components/SplashScreen';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Carrega a fonte personalizada
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    let isMounted = true;
    async function prepare() {
      try {
        // Esconde a splash screen nativa assim que possível
        await SplashScreen.hideAsync();

        // Mostra a splash customizada por 2 segundos
        console.log("Mostrando a splash customizada por 2 segundos...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        // Em caso de erro, mostra no console
        console.warn('Erro ao preparar app:', e);
      } finally {
        // Marca o app como pronto
        if (isMounted) setAppIsReady(true);
      }
    }

    // Só prepara se as fontes estiverem carregadas e o app ainda não estiver pronto
    if (fontsLoaded && !appIsReady) {
      prepare();
    }
    // Cleanup para evitar setState em componente desmontado
    return () => { isMounted = false; };
  }, [fontsLoaded, appIsReady]);

  // Enquanto não estiver pronto, mostra a splash customizada
  if (!appIsReady || !fontsLoaded) {
    return <CustomSplashScreen />;
  }

  // Quando pronto, mostra as telas principais
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}