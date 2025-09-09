import { StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

export default function TabOneScreen() {
  const [fontsLoaded] = useFonts({
    Sansation: require("../../assets/fonts/Sansation-Regular.ttf"),
    "Sansation-Bold": require("../../assets/fonts/Sansation-Bold.ttf")
  });

  if (!fontsLoaded) {
    return null; // ou algum loading
  }

  return (
    <View style={styles.containerFirst}>
      <Text style={styles.title}>ENTRE EM SUA CONTA</Text>

      <View style={styles.separator}/>

      <View style={styles.containerMain}>

        <Text style={styles.normalText}>Entre com seu login</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
          <TextInput style={styles.inputs} placeholder='E-mail' placeholderTextColor="#ACA8A8"/>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="eye-outline" size={20} color="#555" style={styles.icon} />
          <TextInput style={styles.inputs} placeholder='Senha' placeholderTextColor="#ACA8A8" ></TextInput>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerFirst: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  containerMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#ffff",
    fontFamily: "Sansation-Bold",
  },
  normalText: {
    fontSize: 20,
    color: "#ACA8A8",
    fontFamily: "Sansation",
    marginBottom: 50,
  },
  separator: {
    marginVertical: 8,
    height: 1,
    backgroundColor: "#ffff",
  },
  inputContainer: {
    width: 370,
    height: 60,
    flexDirection: "row", // ícone e input lado a lado
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1C209F",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#090C6B",
    marginBottom: 20,
  },
  inputs: {
    flex: 1,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
});
 