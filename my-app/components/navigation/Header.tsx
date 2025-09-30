import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";


type HeaderProps = {
  title: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export function Header({ title, onLeftPress, onRightPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      {/* <TouchableOpacity onPress={onLeftPress}>
        <Ionicons name="settings-outline" size={28} color="white" />
      </TouchableOpacity> */}

      <Text style={styles.headerTitle}>{title}</Text>

      {/* <TouchableOpacity onPress={onRightPress}>
        <Ionicons name="ellipsis-horizontal" size={28} color="white" />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
    position: "relative",
    justifyContent: "center",
  },
  headerTitle: {
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
});