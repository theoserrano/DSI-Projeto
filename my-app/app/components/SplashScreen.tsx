import { View, Image, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splash-icon.png')}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Você pode trocar essa cor pelo tom de azul que preferir
    backgroundColor: '#007AFF', // Um azul padrão do iOS
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150, // Ajuste o tamanho conforme necessário
    height: 150, // Ajuste o tamanho conforme necessário
    resizeMode: 'contain', // Garante que a logo não seja cortada ou esticada
  },
});