import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  DimensionValue,
  StyleProp,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

type CustomButtonSize = 'small' | 'medium' | 'large';
type CustomButtonVariant = 'primary' | 'secondary' | 'custom';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  width?: DimensionValue;  
  height?: DimensionValue;
  size?: CustomButtonSize;
  variant?: CustomButtonVariant;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export const CustomButton = ({
  title,
  onPress,
  width = "100%",
  height,
  size = 'medium',
  variant = 'primary',
  fontSize,
  backgroundColor,
  textColor,
  style,
  textStyle,
  disabled = false,
}: CustomButtonProps) => {
  const theme = useTheme();
  
  const buttonHeight = height || theme.components.button.height[size];
  const buttonFontSize = fontSize || theme.components.button.fontSize[size];
  const buttonBackgroundColor = backgroundColor || 
    (variant === 'primary' ? theme.colors.buttonPrimary : 
     variant === 'secondary' ? theme.colors.secondary : theme.colors.buttonPrimary);
  const buttonTextColor = textColor || theme.colors.buttonText;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { 
          width, 
          height: buttonHeight, 
          backgroundColor: buttonBackgroundColor, 
          borderRadius: theme.components.button.borderRadius,
          paddingHorizontal: theme.components.button.paddingHorizontal,
          opacity: disabled ? 0.6 : 1 
        },
        style,
      ]}
    >
      <Text style={[
        styles.text, 
        { 
          fontSize: buttonFontSize, 
          color: buttonTextColor,
          fontFamily: theme.typography.fontFamily.bold,
        }, 
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
});
