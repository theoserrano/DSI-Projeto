import { TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { styles } from './styles'; // Importa os estilos
import { Link } from "expo-router";

export default function TabOneScreen() {
  // Estados para os campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha

  // Função de login simples com validação
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }
    // Aqui você pode adicionar lógica real de autenticação
    Alert.alert("Login", "Login realizado com sucesso!");
  };

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

            {/* Campo de e-mail */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={25} color="#ACA8A8" style={styles.icon} />
              <TextInput
                style={styles.inputs}
                placeholder='E-mail'
                placeholderTextColor="#ACA8A8"
                keyboardType='email-address'
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                accessibilityLabel="Campo de e-mail"
              />
            </View>

            {/* Campo de senha com botão para ver/ocultar senha */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={25} color="#ACA8A8" style={styles.icon} />
              <TextInput
                style={styles.inputs}
                placeholder='Senha'
                placeholderTextColor="#ACA8A8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Campo de senha"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ paddingHorizontal: 8 }}
                accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#ACA8A8"
                />
              </TouchableOpacity>
            </View>

            {/* Opções: lembrar de mim e esqueci minha senha */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                <MaterialCommunityIcons
                  name={rememberMe ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                  size={24}
                  color="#8A8A8A"
                />
                <Text style={styles.optionsText}> Lembre-se de mim</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert("Recuperação", "Função de recuperação de senha em breve!")}>
                <Text style={styles.optionsText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </View>

            {/* Botão de login */}
            <TouchableOpacity style={styles.loginButtonContainer} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Divisor visual */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Ou</Text>
              <View style={styles.line} />
            </View>

            {/* Rodapé com opção de registro */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={[styles.footerText, styles.registerLink]}>Registre-se</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
