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
        placeholderTextColor="#ACA8A8"
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
    borderColor: "#1C209F",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#090C6B",
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
