import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, DimensionValue } from "react-native";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  width?: DimensionValue;  
  height?: DimensionValue;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const CustomButton = ({
  title,
  onPress,
  width = "100%",
  height = 50,
  fontSize = 16,
  backgroundColor = "#0A0F6D",
  textColor = "white",
  style,
  textStyle,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { width, height, backgroundColor },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize, color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "SansationBold",
  },
});
