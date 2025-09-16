import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = false; // trocar por lógica real (ex: AsyncStorage, contexto)

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}

