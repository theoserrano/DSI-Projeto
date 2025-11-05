import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "@/context/ThemeContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.7; // 70% da altura da tela

type DrawerProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  heightPercentage?: number; // Porcentagem da tela (0-1)
};

export function Drawer({ visible, onClose, title, children, heightPercentage = 0.7 }: DrawerProps) {
  const theme = useTheme();
  const drawerHeight = SCREEN_HEIGHT * heightPercentage;
  const slideAnim = useRef(new Animated.Value(drawerHeight)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: drawerHeight,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, opacityAnim, drawerHeight]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: opacityAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Drawer - Bottom Sheet */}
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              height: drawerHeight,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: "SansationBold",
    fontSize: 20,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
});
