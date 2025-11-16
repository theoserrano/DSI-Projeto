/**
 * Sistema de Logging Simples e Intuitivo
 * 
 * Foca em registrar ações importantes do usuário e eventos da aplicação
 * de forma clara e direta.
 * 
 * OTIMIZAÇÃO: Desabilitado completamente quando não está em modo DEV
 */

const isDev = __DEV__;

// Funções vazias para produção (zero overhead)
const noop = () => {};

/**
 * Registra uma ação do usuário
 * @param action Nome da ação (ex: "Abrir tela de login", "Enviar review")
 * @param details Detalhes adicionais (opcional)
 */
export const logAction = isDev ? (action: string, details?: any) => {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${timestamp}] AÇÃO: ${action}`, details || '');
} : noop;

/**
 * Registra um erro que ocorreu
 * @param error Descrição do erro
 * @param errorObject Objeto de erro (opcional)
 */
export const logError = isDev ? (error: string, errorObject?: any) => {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.error(`[${timestamp}] ERRO: ${error}`, errorObject || '');
} : noop;

/**
 * Registra um aviso
 * @param warning Descrição do aviso
 * @param details Detalhes adicionais (opcional)
 */
export const logWarning = isDev ? (warning: string, details?: any) => {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.warn(`[${timestamp}] AVISO: ${warning}`, details || '');
} : noop;

/**
 * Registra informações sobre navegação
 * @param screen Nome da tela
 * @param params Parâmetros (opcional)
 */
export const logNavigation = isDev ? (screen: string, params?: any) => {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${timestamp}] NAVEGAÇÃO: ${screen}`, params || '');
} : noop;

/**
 * Registra quando dados são carregados
 * @param dataType Tipo de dados (ex: "reviews", "playlists")
 * @param count Quantidade de itens (opcional)
 */
export const logDataLoad = isDev ? (dataType: string, count?: number) => {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  const message = count !== undefined 
    ? `Carregou ${count} ${dataType}` 
    : `Carregou ${dataType}`;
  console.log(`[${timestamp}] DADOS: ${message}`);
} : noop;
