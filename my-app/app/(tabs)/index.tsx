import { StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, View, Text } from 'react-native';
import { useFonts } from "expo-font";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { styles } from './index.styles'; // Esta linha conecta com o arquivo que você criou
import InputContainer from "@/components/InputContainer"

export default function TabOneScreen() {
  const [fontsLoaded] = useFonts({
    Sansation: require("../../assets/fonts/Sansation-Regular.ttf"),
    "Sansation-Bold": require("../../assets/fonts/Sansation-Bold.ttf")
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  if (!fontsLoaded) {
    return null; // ou algum loading
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.containerFirst}>

          <Text style={styles.title}>ENTRE EM SUA CONTA</Text>
          <View style={styles.separator} />
          <View style={styles.containerMain}>
            <Text style={styles.normalText}>Entre com seu login</Text>

            <InputContainer
              placeholder='E-mail'
              placeholderTextColor="#ACA8A8"
              keyboardType='email-address'
              value={email}
              onChangeText={setEmail}
              icon={<Ionicons name="mail-outline" size={25} color="#ACA8A8" />}
            />
            
            <InputContainer
              placeholder='Senha'
              placeholderTextColor="#ACA8A8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              icon={<Ionicons name="lock-closed-outline" size={25} color="#ACA8A8" style={styles.icon} />}
            />

            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                <MaterialCommunityIcons
                  name={rememberMe ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                  size={24}
                  color="#8A8A8A"
                />
                <Text style={styles.optionsText}> Lembre-se de mim</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.optionsText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButtonContainer} >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Ou</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
              <TouchableOpacity>
                <Text style={[styles.footerText, styles.registerLink]}>Registre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}