import { FirebaseError } from "firebase/app";

/**
 * Mapeia códigos de erro do Firebase Auth para mensagens amigáveis em português.
 * @param error O objeto de erro do Firebase.
 * @returns Uma string com a mensagem de erro para o usuário.
 */
export const getFirebaseAuthErrorMessage = (error: any): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "O formato do e-mail é inválido.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "E-mail ou senha inválidos.";
      case "auth/email-already-in-use":
        return "Este e-mail já está em uso por outra conta.";
      case "auth/weak-password":
        return "A senha é muito fraca. Tente uma mais forte.";
      default:
        return "Ocorreu um erro inesperado. Tente novamente mais tarde.";
    }
  }
  return "Ocorreu um erro inesperado. Por favor, tente novamente.";
};