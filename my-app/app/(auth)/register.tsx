import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InputContainer from "../../components/ui/InputContainer";
import { auth } from "../../services/firebaseConfig";
import { styles } from "../../styles/styles";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrors";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter(); // hook do Expo Router

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não conferem.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    } catch (error: any) {
      const errorMessage = getFirebaseAuthErrorMessage(error);
      Alert.alert("Erro no Cadastro", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.containerFirst}>
          <Text style={styles.title}>CRIE SUA CONTA</Text>
          <View style={styles.separator} />
          <View style={styles.containerMain}>
            <Text style={styles.normalText}>Preencha os dados abaixo</Text>

            <InputContainer
              icon={<Ionicons name="person-outline" size={25} color="#ACA8A8" />}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              accessibilityLabel="Campo de nome"
              autoCorrect={false}
            />

            <InputContainer
              icon={<Ionicons name="mail-outline" size={25} color="#ACA8A8" />}
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              accessibilityLabel="Campo de e-mail"
            />

            <InputContainer
              icon={<Ionicons name="lock-closed-outline" size={25} color="#ACA8A8" />}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              accessibilityLabel="Campo de senha"
              autoCapitalize="none"
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#ACA8A8"
                  />
                </TouchableOpacity>
              }
            />

            <InputContainer
              icon={<Ionicons name="lock-closed-outline" size={25} color="#ACA8A8" />}
              placeholder="Confirme a senha"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              accessibilityLabel="Campo de confirmação de senha"
              autoCapitalize="none"
              autoCorrect={false}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#ACA8A8"
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={handleRegister}
            >
              <Text style={styles.loginButtonText}>REGISTRAR</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push("/")}>
                <Text style={[styles.footerText, styles.registerLink]}>
                  Faça login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
