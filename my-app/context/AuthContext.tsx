import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../services/supabaseConfig";
import { generateUserCode } from "@/utils/userCode";
import { logAction, logError, logWarning } from "@/utils/logger";

// Define o tipo para o valor do contexto
interface AuthContextType {
  user: any | null;
  userCode: string | null;
  signOut: () => Promise<void>;
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
const authEnabled =  true //process.env.AUTH_ENABLED === "true";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();
  const segments = useSegments();
  const userCode = useMemo(() => {
    if (!user) {
      return null;
    }

    return generateUserCode(user.uid || user.email || user.displayName || "");
  }, [user]);

  // Função de logout
  const signOut = async () => {
    try {
      logAction('Usuário fez logout');
      if (authEnabled) {
        await auth.signOut();
      }
      setUser(null);
      router.replace("/login");
    } catch (error) {
      logError("Erro ao fazer logout", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!authEnabled) {
      logWarning('Autenticação desabilitada - usando usuário de teste');
      // Se a autenticação estiver desativada, simula usuário autenticado
      // Usando UUID fixo que corresponde ao usuário de teste no banco
      setUser({
        id: "571bdc19-c71b-435a-ae15-eb7542b6b949",
        email: "cocoexixi@example.com",
        user_metadata: { name: "cocoexixi" },
      });

      const inAuthGroup = segments[0] === "(auth)";
      if (inAuthGroup) {
        router.replace("/(tabs)/home");
      }
      return;
    }

    // onAuthStateChange retorna um objeto com subscription
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      const inAuthGroup = segments[0] === "(auth)";

      // Lógica de redirecionamento
      if (currentUser && inAuthGroup) {
        logAction('Usuário autenticado - redirecionando para home');
        router.replace("/(tabs)/home");
      } else if (!currentUser && !inAuthGroup) {
        logAction('Usuário não autenticado - redirecionando para login');
        router.replace("/login");
      }
    });

    // Cleanup
    return () => subscription?.unsubscribe?.();
  }, [segments]);

  return (
    <AuthContext.Provider value={{ user, userCode, signOut }}>{children}</AuthContext.Provider>
  );
}
