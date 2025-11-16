/**
 * Configuração dos ícones da navegação inferior (Bottom Navigation)
 * 
 * Este arquivo centraliza a configuração dos ícones da barra de navegação
 * para manter consistência em todas as telas do aplicativo.
 */

export const BOTTOM_NAV_ICONS = [
  { icon: "home-outline", path: "/(tabs)/home" },
  { icon: "search-outline", path: "/(tabs)/search" },
  { icon: "add-circle", path: "/(tabs)/add" },
  { icon: "musical-notes-outline", path: "/(tabs)/musicalTaste" },
  { icon: "person-outline", path: "/(tabs)/profile" },
] as const;
