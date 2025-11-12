/**
 * Sistema de Logging Simples e Intuitivo
 * 
 * Foca em registrar ações importantes do usuário e eventos da aplicação
 * de forma clara e direta.
 */

const isDev = __DEV__;

/**
 * Registra uma ação do usuário
 * @param action Nome da ação (ex: "Abrir tela de login", "Enviar review")
 * @param details Detalhes adicionais (opcional)
 */
export function logAction(action: string, details?: any) {
  if (!isDev) return;
  
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${timestamp}] AÇÃO: ${action}`, details || '');
}

/**
 * Registra um erro que ocorreu
 * @param error Descrição do erro
 * @param errorObject Objeto de erro (opcional)
 */
export function logError(error: string, errorObject?: any) {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.error(`[${timestamp}] ERRO: ${error}`, errorObject || '');
}

/**
 * Registra um aviso
 * @param warning Descrição do aviso
 * @param details Detalhes adicionais (opcional)
 */
export function logWarning(warning: string, details?: any) {
  if (!isDev) return;
  
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.warn(`[${timestamp}] AVISO: ${warning}`, details || '');
}

/**
 * Registra informações sobre navegação
 * @param screen Nome da tela
 * @param params Parâmetros (opcional)
 */
export function logNavigation(screen: string, params?: any) {
  if (!isDev) return;
  
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${timestamp}] NAVEGAÇÃO: ${screen}`, params || '');
}

/**
 * Registra quando dados são carregados
 * @param dataType Tipo de dados (ex: "reviews", "playlists")
 * @param count Quantidade de itens (opcional)
 */
export function logDataLoad(dataType: string, count?: number) {
  if (!isDev) return;
  
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  const message = count !== undefined 
    ? `Carregou ${count} ${dataType}` 
    : `Carregou ${dataType}`;
  console.log(`[${timestamp}] DADOS: ${message}`);
}
