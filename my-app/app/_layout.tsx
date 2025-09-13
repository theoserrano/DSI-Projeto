import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Importe o componente de Splash
import CustomSplashScreen from './components/SplashScreen';

// Nós NÃO vamos mais usar o preventAutoHideAsync() aqui para este teste.

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      // 1. Esconde a splash screen nativa assim que possível.
      await SplashScreen.hideAsync();

      try {
        // 2. Adiciona a pausa para podermos ver o NOSSO componente de splash.
        console.log("Mostrando a splash customizada por 3 segundos...");
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        // 3. Avisa que o app está pronto.
        setAppIsReady(true);
      }
    }

    // Apenas chame a preparação se as fontes estiverem carregadas
    if(fontsLoaded){
      prepare();
    }
  }, [fontsLoaded]);

  // Se as fontes não carregaram ou o app não está pronto, mostre seu componente.
  if (!appIsReady || !fontsLoaded) {
    return <CustomSplashScreen />;
  }

  // Se o app estiver pronto, mostre as telas.
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}