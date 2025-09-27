import { ActivityIndicator, View } from "react-native";

export default function Index() {
  // Esta tela agora serve apenas como um ponto de entrada.
  // O AuthProvider em _layout.tsx cuidará de todo o redirecionamento.
  // Exibir um indicador de carregamento é uma boa prática enquanto a lógica de auth decide para onde ir.
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
