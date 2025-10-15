import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";

import { CustomButton } from "@/components/ui/CustomButton";
import { useTheme } from "@/context/ThemeContext";

type LocationPickerModalProps = {
  visible: boolean;
  initialLocation?: { latitude: number; longitude: number };
  onLocationSelected: (location: { latitude: number; longitude: number }) => void;
  onClose: () => void;
};

// Região padrão: Nordeste do Brasil
const DEFAULT_REGION: Region = {
  latitude: -8.0578,
  longitude: -34.8829,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

// Localização padrão: Recife, PE
const DEFAULT_LOCATION = {
  latitude: -8.0578,
  longitude: -34.8829,
};

export function LocationPickerModal({
  visible,
  initialLocation,
  onLocationSelected,
  onClose,
}: LocationPickerModalProps) {
  const theme = useTheme();
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || DEFAULT_LOCATION
  );

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = () => {
    onLocationSelected(selectedLocation);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Selecione a Localização
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
            Toque no mapa para posicionar o marcador
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={
            initialLocation
              ? {
                  ...initialLocation,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
              : DEFAULT_REGION
          }
          onPress={handleMapPress}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
          loadingEnabled={true}
          loadingBackgroundColor={theme.colors.background}
        >
          <Marker
            coordinate={selectedLocation}
            pinColor={theme.colors.primary}
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setSelectedLocation({ latitude, longitude });
            }}
            tracksViewChanges={false}
          />
        </MapView>

        <View style={[styles.footer, { backgroundColor: theme.colors.card }]}>
          <View style={styles.coordsContainer}>
            <Text style={[styles.coordsLabel, { color: theme.colors.muted }]}>
              Coordenadas:
            </Text>
            <Text style={[styles.coordsText, { color: theme.colors.text }]}>
              {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.actions}>
            <CustomButton
              title="Cancelar"
              onPress={onClose}
              width="auto"
              height={48}
              backgroundColor={theme.colors.card}
              textColor={theme.colors.muted}
              style={[styles.actionButton, { borderWidth: 1, borderColor: theme.colors.box }]}
            />
            <CustomButton
              title="Confirmar Localização"
              onPress={handleConfirm}
              width="auto"
              height={48}
              backgroundColor={theme.colors.primary}
              textColor="#FFFFFF"
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontFamily: "SansationBold",
    fontSize: 22,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Sansation",
    fontSize: 14,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  coordsContainer: {
    marginBottom: 16,
  },
  coordsLabel: {
    fontFamily: "Sansation",
    fontSize: 13,
    marginBottom: 4,
  },
  coordsText: {
    fontFamily: "SansationBold",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
