/**
 * Gera um ID único baseado em texto para eventos
 * Formato: prefixo-timestamp-random
 * Exemplo: "evt-1697234567-a3f2"
 */
export function generateEventId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);
  return `evt-${timestamp}-${random}`;
}

/**
 * Normaliza uma string para criar um slug/ID legível
 * Remove acentos, espaços e caracteres especiais
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos
    .replace(/\s+/g, "-") // Substituir espaços por hífen
    .replace(/[^\w-]+/g, "") // Remover caracteres especiais
    .replace(/--+/g, "-") // Substituir múltiplos hífens por um
    .replace(/^-+/, "") // Remover hífen do início
    .replace(/-+$/, ""); // Remover hífen do final
}

/**
 * Gera um ID semântico baseado no título do evento
 * Formato: slug-random
 * Exemplo: "show-rock-sp-a3f2"
 */
export function generateSemanticEventId(title: string): string {
  const slug = slugify(title).substring(0, 30); // Limita tamanho
  const random = Math.random().toString(36).substring(2, 6);
  return `${slug}-${random}`;
}
