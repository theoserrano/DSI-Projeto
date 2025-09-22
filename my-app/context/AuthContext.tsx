import { useRouter, useSegments } from "expo-router";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebaseConfig";

// Define o tipo para o valor do contexto
interface AuthContextType {
  user: User | null;
}

// Cria o contexto com um valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para usar o contexto de autenticação de forma segura
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // onAuthStateChanged retorna uma função para "cancelar a inscrição" (unsubscribe)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      const inAuthGroup = segments[0] === "(auth)";

      // Lógica de redirecionamento
      if (currentUser && inAuthGroup) {
        // Se o usuário está logado E está em uma tela de autenticação (login/registro),
        // o levamos para a tela principal.
        router.replace("/(tabs)/home"); // Ajuste para a sua rota principal
      } else if (!currentUser && !inAuthGroup) {
        router.replace("/login");
      }
    });

    // Limpa o listener quando o componente é desmontado para evitar vazamentos de memória
    return () => unsubscribe();
  }, [user, segments]); // Dependências do useEffect

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
