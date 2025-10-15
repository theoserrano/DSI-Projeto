import colors from "./Colors";

export const lightTheme = {
  mode: "light" as const,
  colors: {
    // Background & Surface colors
    background: colors.background.light,
    card: colors.card.light,
    popup: colors.popup.light,
    box: colors.box.light,
    
    // Text colors
    text: colors.text.light,
    textSecondary: colors.text.muted,
    placeholder: "#6977BD",
    
    // Brand colors
    primary: colors.primary.light,
    secondary: colors.secondary.light,
    
    // Feedback colors
    error: colors.feedback.error,
    success: colors.feedback.success,
    warning: colors.feedback.warning,
    
    // UI Element colors
    border: "#2D3A8C",
    borderLight: "#1C209F",
    icon: "#6977BD",
    star: colors.star,
    muted: colors.text.muted,
    white: colors.white,
    
    // Component specific colors
    inputBackground: "#FAFAFA",
    buttonPrimary: "#0A0F6D",
    buttonText: "#FFFFFF",
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  
  typography: {
    // Font Families
    fontFamily: {
      regular: "Sansation",
      bold: "SansationBold",
    },
    
    // Font Sizes
    fontSize: {
      xs: 11,
      sm: 12,
      md: 13,
      base: 14,
      lg: 15,
      xl: 16,
      xxl: 18,
      title: 20,
      heading: 22,
      h2: 24,
      h1: 28,
    },
    
    // Line Heights (relativos ao fontSize)
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    // Font Weights (para fallback)
    fontWeight: {
      normal: "400" as const,
      semibold: "600" as const,
      bold: "700" as const,
      extrabold: "900" as const,
    },
  },
  
  components: {
    button: {
      borderRadius: 10,
      height: {
        small: 40,
        medium: 50,
        large: 60,
      },
      fontSize: {
        small: 14,
        medium: 16,
        large: 18,
      },
      paddingHorizontal: 16,
    },
    
    input: {
      height: 60,
      borderRadius: 10,
      borderWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 14,
      iconSize: 25,
      iconMargin: 8,
    },
    
    card: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    
    modal: {
      borderRadius: 16,
      padding: 20,
      maxWidth: "90%",
    },
    
    avatar: {
      size: {
        small: 32,
        medium: 40,
        large: 50,
        xlarge: 60,
      },
      borderRadius: 20,
    },
  },
} as const;

export const darkTheme = {
  ...lightTheme,
  mode: "dark" as const,
  colors: {
    ...lightTheme.colors,
    background: colors.background.dark,
    text: colors.text.dark,
    card: colors.card.dark,
    popup: colors.popup.dark,
    box: colors.box.dark,
    inputBackground: "#1E1E1E",
    primary: colors.primary.dark,
  },
};

export type AppTheme = typeof lightTheme;