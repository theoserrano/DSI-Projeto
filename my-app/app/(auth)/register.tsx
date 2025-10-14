import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
// Importe a função de criação de usuário do Firebase
// import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { use, useState } from "react";
// Importe todos os componentes necessários
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import InputContainer from "../../components/ui/InputContainer";
import { auth, supabase } from "../../services/supabaseConfig";
import { styles } from '../../styles/styles'; // Seus estilos
import { getSupabaseAuthErrorMessage } from "../../utils/supabaseErrors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.containerFirst}>
                        {/* Título da tela de registro */}
                        <Text style={[styles.title, { marginTop: 50, textAlign: 'center' }]}>
                            {"CRIE SUA\nCONTA"}
                        </Text>

                        <View style={styles.containerMain}>
                            <Text style={styles.normalText}>Faça o seu cadastro</Text>

                            {/* Campo de Nome Completo */}
                            <InputContainer
                                icon={<Ionicons name="person-outline" size={25} color="#6977BD" />}
                                placeholder="Nome Completo"
                                autoCapitalize="words"
                                value={name}
                                onChangeText={setName}
                            />

                            <InputContainer
                                icon={<Ionicons name="person-outline" size={25} color="#6977BD" />}
                                placeholder="Nome de Usuário"
                                autoCapitalize="words"
                                value={Username}
                                onChangeText={setUsername}
                            />

                            {/* Campo de e-mail */}
                            <InputContainer
                                icon={<Ionicons name="mail-outline" size={25} color="#6977BD" />}
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />

                            {/* Campo de senha */}
                            <InputContainer
                                icon={<Ionicons name="lock-closed-outline" size={25} color="#6977BD" />}
                                placeholder="Senha"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                rightIcon={
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#6977BD" />
                                    </TouchableOpacity>
                                }
                            />

                            {/* Campo de confirmar senha */}
                            <InputContainer
                                icon={<Ionicons name="lock-closed-outline" size={25} color="#6977BD" />}
                                placeholder="Confirmar Senha"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                rightIcon={
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#6977BD" />
                                    </TouchableOpacity>
                                }
                            />

                            {/* Botão de Cadastro */}
                            <TouchableOpacity style={styles.loginButtonContainer} onPress={handleRegister}>
                                <Text style={styles.loginButtonText}>CADASTRAR</Text>
                            </TouchableOpacity>

                            {/* Rodapé com opção de login */}
                            <View style={styles.footerContainer}>
                                <Text style={styles.footerText}>Já tem uma conta? </Text>
                                <Link href="/" asChild>
                                    <TouchableOpacity>
                                        <Text style={[styles.footerText, styles.registerLink]}>Faça Login</Text>
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