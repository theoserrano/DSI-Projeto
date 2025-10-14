export function getSupabaseAuthErrorMessage(error: any): string {
  if (!error) return 'Ocorreu um erro desconhecido.';

  // Supabase v2 auth responses often return an error with message
  const msg = error?.message || error?.error_description || error?.error || '';

  // Map common messages/statuses to user-friendly pt-BR messages
  const text = String(msg).toLowerCase();

  if (!text) return 'Ocorreu um erro de autenticação.';

  if (text.includes('invalid email') || text.includes('invalid_login_credentials') || text.includes('invalid login')) {
    return 'E-mail inválido ou credenciais incorretas.';
  }
  if (text.includes('password') && text.includes('invalid')) {
    return 'Senha inválida.';
  }
  if (text.includes('user not found') || text.includes('not found')) {
    return 'Usuário não encontrado.';
  }
  if (text.includes('duplicate') || text.includes('already exists') || text.includes('unique')) {
    return 'E-mail já está em uso.';
  }
  if (text.includes('network') || text.includes('failed to fetch')) {
    return 'Erro de rede. Verifique sua conexão.';
  }

  // Default: return the original message capitalized
  return (msg && String(msg).charAt(0).toUpperCase() + String(msg).slice(1)) || 'Ocorreu um erro.';
}
