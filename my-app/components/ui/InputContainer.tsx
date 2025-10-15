import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type InputContainerProps = TextInputProps & {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode; // ícone à direita, ex: olho
};

export default function InputContainer({ icon, rightIcon, style, ...props }: InputContainerProps) {
  const theme = useTheme();
  
  return (
    <View style={[
      styles.inputWrapper,
      {
        height: theme.components.input.height,
        borderColor: theme.colors.border,
        borderRadius: theme.components.input.borderRadius,
        borderWidth: theme.components.input.borderWidth,
        paddingHorizontal: theme.components.input.paddingHorizontal,
        paddingVertical: theme.components.input.paddingVertical,
        backgroundColor: theme.colors.inputBackground,
        marginBottom: theme.spacing.lg,
      }
    ]}>
      {icon && <View style={[styles.icon, { marginRight: theme.components.input.iconMargin }]}>{icon}</View>}
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.base,
            fontFamily: theme.typography.fontFamily.regular,
          },
          style
        ]}
        placeholderTextColor={theme.colors.placeholder}
        {...props}
      />
      {rightIcon && <View style={[styles.rightIcon, { marginLeft: theme.components.input.iconMargin }]}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
  },
});
