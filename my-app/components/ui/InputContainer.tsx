import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";

type InputContainerProps = TextInputProps & {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode; // ícone à direita, ex: olho
};

export default function InputContainer({ icon, rightIcon, style, ...props }: InputContainerProps) {
  return (
    <View style={styles.inputWrapper}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#6977BD"
        {...props}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D3A8C",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FAFAFA",
    marginBottom: 20,
  },
  icon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#fff",
  },
});
