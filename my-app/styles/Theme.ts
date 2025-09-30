import colors from "./Colors";

export const lightTheme = {
  colors: {
    background: colors.background.light,
    text: colors.text.light,
    primary: colors.primary.light,
    popupBackground: colors.popupBackground.light,
    boxBackground: colors.boxBackground.light,
    secondary: colors.secondary.light,
    error: colors.feedback.error,
    success: colors.feedback.success,
    warning: colors.feedback.warning,
    muted: colors.text.muted,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    title: 24,
    subtitle: 18,
    body: 14,
    small: 12,
  },
} as const;

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: colors.background.dark,
    text: colors.text.dark,
  },
};

export type AppTheme = typeof lightTheme;