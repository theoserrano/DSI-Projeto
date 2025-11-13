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
  PanResponder,
  PanResponderGestureState,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "@/context/ThemeContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const CLOSE_THRESHOLD = 100; // Distância mínima para fechar (em pixels)
const SWIPE_VELOCITY_THRESHOLD = 0.5; // Velocidade mínima para fechar automaticamente

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
  const dragY = useRef(new Animated.Value(0)).current;
  const isDragging = useRef(false);
  const handleScale = useRef(new Animated.Value(1)).current;

  // PanResponder para detectar gestos de arrastar
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Só ativa o pan responder se arrastar para baixo
        return gestureState.dy > 5;
      },
      onPanResponderGrant: () => {
        isDragging.current = true;
        // Anima o handle para indicar que está sendo arrastado
        Animated.spring(handleScale, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        // Permite arrastar para baixo normalmente
        if (gestureState.dy > 0) {
          dragY.setValue(gestureState.dy);
        } else {
          // Efeito rubber band ao tentar arrastar para cima (resistência)
          const resistance = 3;
          dragY.setValue(gestureState.dy / resistance);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        isDragging.current = false;
        // Volta o handle ao tamanho normal
        Animated.spring(handleScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }).start();
        handleDragRelease(gestureState);
      },
      onPanResponderTerminate: (_, gestureState) => {
        isDragging.current = false;
        Animated.spring(handleScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }).start();
        handleDragRelease(gestureState);
      },
    })
  ).current;

  const handleDragRelease = (gestureState: PanResponderGestureState) => {
    const { dy, vy } = gestureState;

    // Se arrastou além do threshold ou velocidade alta para baixo, fecha o drawer
    if (dy > CLOSE_THRESHOLD || vy > SWIPE_VELOCITY_THRESHOLD) {
      closeDrawer();
    } else {
      // Volta para a posição original
      Animated.spring(dragY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(dragY, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: drawerHeight,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      dragY.setValue(0);
    });
  };

  useEffect(() => {
    if (visible) {
      dragY.setValue(0);
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

  // Interpola a opacidade do backdrop baseado no drag
  const backdropOpacity = opacityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Adiciona fade out ao backdrop durante o drag
  const backdropDragOpacity = dragY.interpolate({
    inputRange: [0, drawerHeight / 2],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeDrawer}>
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: Animated.multiply(backdropOpacity, backdropDragOpacity),
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
                  translateY: Animated.add(slideAnim, dragY),
                },
              ],
            },
          ]}
        >
          {/* Handle Bar - Área de arraste */}
          <Animated.View 
            style={styles.handleContainer}
            {...panResponder.panHandlers}
          >
            <Animated.View 
              style={[
                styles.handle, 
                { 
                  backgroundColor: theme.colors.border,
                  transform: [{ scaleX: handleScale }, { scaleY: handleScale }],
                }
              ]} 
            />
          </Animated.View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
            <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
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
    opacity: 0.5,
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
