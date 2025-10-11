import { useRouter, useSegments } from "expo-router";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../services/firebaseConfig";
import { generateUserCode } from "@/utils/userCode";

// Define o tipo para o valor do contexto
interface AuthContextType {
  user: User | null;
  userCode: string | null;
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

// Flag para ativar/desativar autenticação
const authEnabled = process.env.AUTH_ENABLED === "true";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const userCode = useMemo(() => {
    if (!user) {
      return null;
    }

    return generateUserCode(user.uid || user.email || user.displayName || "");
  }, [user]);

  useEffect(() => {
    if (!authEnabled) {
      // Se a autenticação estiver desativada, simula usuário autenticado
      setUser({
        uid: "dev",
        email: "dev@local",
        displayName: "Theo Garrozi",
      } as User);

      const inAuthGroup = segments[0] === "(auth)";
      if (inAuthGroup) {
        router.replace("/(tabs)/home");
      }
      return;
    }

    // onAuthStateChanged retorna uma função para "cancelar a inscrição" (unsubscribe)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      const inAuthGroup = segments[0] === "(auth)";

      // Lógica de redirecionamento
      if (currentUser && inAuthGroup) {
        router.replace("/(tabs)/home"); // Ajuste para a sua rota principal
      } else if (!currentUser && !inAuthGroup) {
        router.replace("/login");
      }
    });

    // Limpa o listener quando o componente é desmontado para evitar vazamentos de memória
    return () => unsubscribe();
  }, [segments]); // Remova 'user' das dependências

  return (
    <AuthContext.Provider value={{ user, userCode }}>{children}</AuthContext.Provider>
  );
}
