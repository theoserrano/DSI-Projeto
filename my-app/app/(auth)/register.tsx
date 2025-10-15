import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { use, useState } from "react";
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
import { auth, supabase } from "../../services/supabaseConfig";
import { getSupabaseAuthErrorMessage } from "../../utils/supabaseErrors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

export default function RegisterScreen() {
    const theme = useTheme();
    
    // Estados para os campos do formulário
    const [name, setName] = useState("");
    const [Username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    // Função de registro com validação
    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        try {
            // Cria o usuário via Supabase
            const { data, error } = await auth.signUp({ email, password});
            if (error) throw error;
            const userId = data.user?.id;
            if (!userId) throw new Error("User ID not found after sign up");
            const { error: insertError } = await supabase.from('profiles')
            .insert([{
                id: userId,
                name: name,
                username: Username,
                avatar_url: null,
            }])
            
        } catch (error: any) {
            console.error(error);
            const errorMessage = getSupabaseAuthErrorMessage(error);
            Alert.alert("Erro no Cadastro", errorMessage);
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
                        {/* Título da tela de registro */}
                        <Text style={{
                            marginTop: 50,
                            textAlign: 'center',
                            fontSize: theme.typography.fontSize.h1,
                            color: theme.colors.primary,
                            fontFamily: theme.typography.fontFamily.bold,
                        }}>
                            {"CRIE SUA\nCONTA"}
                        </Text>

                        <View style={localStyles.containerMain}>
                            <Text style={{
                                fontSize: theme.typography.fontSize.title,
                                color: theme.colors.text,
                                fontFamily: theme.typography.fontFamily.regular,
                                marginBottom: 20,
                                textAlign: "center"
                            }}>Faça o seu cadastro</Text>

                            {/* Campo de Nome Completo */}
                            <InputContainer
                                icon={<Ionicons name="person-outline" size={theme.components.input.iconSize} color={theme.colors.icon} />}
                                placeholder="Nome Completo"
                                autoCapitalize="words"
                                value={name}
                                onChangeText={setName}
                            />

                            <InputContainer
                                icon={<Ionicons name="person-outline" size={theme.components.input.iconSize} color={theme.colors.icon} />}
                                placeholder="Nome de Usuário"
                                autoCapitalize="words"
                                value={Username}
                                onChangeText={setUsername}
                            />

                            {/* Campo de e-mail */}
                            <InputContainer
                                icon={<Ionicons name="mail-outline" size={theme.components.input.iconSize} color={theme.colors.icon} />}
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />

                            {/* Campo de senha */}
                            <InputContainer
                                icon={<Ionicons name="lock-closed-outline" size={theme.components.input.iconSize} color={theme.colors.icon} />}
                                placeholder="Senha"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                rightIcon={
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color={theme.colors.icon} />
                                    </TouchableOpacity>
                                }
                            />

                            {/* Campo de confirmar senha */}
                            <InputContainer
                                icon={<Ionicons name="lock-closed-outline" size={theme.components.input.iconSize} color={theme.colors.icon} />}
                                placeholder="Confirmar Senha"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                rightIcon={
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={24} color={theme.colors.icon} />
                                    </TouchableOpacity>
                                }
                            />

                            {/* Botão de Cadastro */}
                            <TouchableOpacity 
                                style={{
                                    backgroundColor: theme.colors.buttonPrimary,
                                    justifyContent: 'center',
                                    padding: 16,
                                    borderRadius: theme.components.button.borderRadius,
                                    alignItems: 'center',
                                    marginTop: 20,
                                }}
                                onPress={handleRegister}
                            >
                                <Text style={{
                                    color: theme.colors.buttonText,
                                    fontSize: theme.typography.fontSize.xxl,
                                    fontFamily: theme.typography.fontFamily.bold,
                                }}>CADASTRAR</Text>
                            </TouchableOpacity>

                            {/* Rodapé com opção de login */}
                            <View style={localStyles.footerContainer}>
                                <Text style={[localStyles.footerText, { 
                                    color: theme.colors.text, 
                                    fontFamily: theme.typography.fontFamily.regular, 
                                    fontSize: theme.typography.fontSize.base 
                                }]}>
                                    Já tem uma conta?{' '}
                                </Text>
                                <Link href="/" asChild>
                                    <TouchableOpacity>
                                        <Text style={[localStyles.footerText, localStyles.registerLink, { 
                                            color: theme.colors.primary, 
                                            fontFamily: theme.typography.fontFamily.bold, 
                                            fontSize: theme.typography.fontSize.base 
                                        }]}>
                                            Faça Login
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