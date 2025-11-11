import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { 
    Alert, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView, 
    StyleSheet,
    Text, 
    TouchableOpacity, 
    View 
} from 'react-native';
import InputContainer from "../../components/ui/InputContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from '../../services/supabaseConfig';
import { getSupabaseAuthErrorMessage } from '../../utils/supabaseErrors';
import { useTheme } from "@/context/ThemeContext";

export default function TabOneScreen() {
  const theme = useTheme();
  
  // Estados para os campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
  const router = useRouter();

  // Função de login simples com validação
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }
    try {
      const { error } = await auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Login bem-sucedido - usuário será redirecionado automaticamente
    } catch (error: any) {
      console.error(error);
      const errorMessage = getSupabaseAuthErrorMessage(error);
      Alert.alert("Erro no Login", errorMessage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={localStyles.containerFirst}>
            <Text style={{
              marginTop: 50,
              textAlign: 'center',
              fontSize: theme.typography.fontSize.h1,
              color: theme.colors.primary,
              fontFamily: theme.typography.fontFamily.bold,
            }}>
              {"ENTRE EM\nSUA CONTA"}
            </Text>

            <View style={localStyles.containerMain}>
              <Text style={{
                fontSize: theme.typography.fontSize.title,
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.regular,
                marginBottom: 20,
                textAlign: "center"
              }}>Entre com seu login</Text>

              {/* Campo de e-mail */}
              <InputContainer
                icon={<Ionicons name="mail-outline" size={theme.components.input.iconSize} color={theme.colors.icon} />}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                accessibilityLabel="Campo de e-mail"
              />

              {/* Campo de senha com botão para ver/ocultar senha */}
              <InputContainer
                icon={<Ionicons name="lock-closed-outline" size={theme.components.input.iconSize} color={theme.colors.icon} />}
                placeholder="Senha"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Campo de senha"
                autoCapitalize="none"
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color={theme.colors.icon}
                    />
                  </TouchableOpacity>
                }
              />

              {/* Opções: lembrar de mim e esqueci minha senha */}
              <View style={localStyles.optionsContainer}>
                <TouchableOpacity style={localStyles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                  <MaterialCommunityIcons
                    name={rememberMe ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                    size={24}
                    color={theme.colors.text}
                  />
                  <Text style={{
                    color: theme.colors.text,
                    marginLeft: 8,
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.base,
                  }}> Lembre-se de mim</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => console.log("Recuperação de senha - em desenvolvimento")}>
                  <Text style={{
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.base,
                  }}>Esqueci minha senha</Text>
                </TouchableOpacity>
              </View>

              {/* Botão de login */}
              <TouchableOpacity 
                style={{
                  backgroundColor: theme.colors.buttonPrimary,
                  justifyContent: 'center',
                  padding: 16,
                  borderRadius: theme.components.button.borderRadius,
                  alignItems: 'center',
                  marginTop: 20,
                }}
                onPress={handleLogin}
              >
                <Text style={{
                  color: theme.colors.buttonText,
                  fontSize: theme.typography.fontSize.xxl,
                  fontFamily: theme.typography.fontFamily.bold,
                }}>LOGIN</Text>
              </TouchableOpacity>
              
              {/* Comentado para remover o divisor "Ou"
              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>Ou</Text>
                <View style={styles.line} />
              </View>
              */}

              {/* Rodapé com opção de registro */}
              <View style={localStyles.footerContainer}>
                <Text style={[localStyles.footerText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.regular, fontSize: theme.typography.fontSize.base }]}>
                  Ainda não tem uma conta?{' '}
                </Text>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text style={[localStyles.footerText, localStyles.registerLink, { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.fontSize.base }]}>
                      Registre-se
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  containerFirst: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  containerMain: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 2,
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  footerText: {
    textAlign: 'center',
  },
  registerLink: {
    textDecorationLine: 'underline',
  },
});