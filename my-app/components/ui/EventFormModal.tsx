import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  TextStyle,
} from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { CustomButton } from "@/components/ui/CustomButton";
import { LocationPickerModal } from "@/components/ui/LocationPickerModal";
import { EVENT_GENRES, EVENT_TYPES } from "@/constants/events";
import { useTheme } from "@/context/ThemeContext";
import { EventGenre, EventType, ShowEvent } from "@/types/shows";

export type EventFormValues = {
  title: string;
  description: string;
  eventType: EventType;
  genres: EventGenre[];
  locationName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  startsAt: string;
  endsAt: string;
  ticketsUrl: string;
  promoterContact: string;
  isPublic: boolean;
};

type EventFormModalProps = {
  visible: boolean;
  mode: "create" | "edit";
  initialEvent?: ShowEvent | null;
  onSubmit: (values: EventFormValues) => Promise<void> | void;
  onClose: () => void;
  isSubmitting?: boolean;
};

const EMPTY_VALUES: EventFormValues = {
  title: "",
  description: "",
  eventType: "show",
  genres: ["general"],
  locationName: "",
  address: "",
  city: "",
  state: "",
  country: "Brasil",
  latitude: "",
  longitude: "",
  startsAt: "",
  endsAt: "",
  ticketsUrl: "",
  promoterContact: "",
  isPublic: true,
};

// Helper para formatar data no formato brasileiro
function formatBrazilianDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return "";
  }
}

// Helper para converter data brasileira para ISO
function parseBrazilianDate(brDateStr: string): Date | null {
  if (!brDateStr) return null;
  const match = brDateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, day, month, year, hours, minutes] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
}

export function EventFormModal({
  visible,
  mode,
  initialEvent,
  onSubmit,
  onClose,
  isSubmitting = false,
}: EventFormModalProps) {
  const theme = useTheme();
  const [formValues, setFormValues] = useState<EventFormValues>(() =>
    initialEvent ? mapEventToForm(initialEvent) : getDefaultFormValues()
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Estados para os pickers
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date>(new Date());
  const [tempEndDate, setTempEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (visible) {
      setFormValues(initialEvent ? mapEventToForm(initialEvent) : getDefaultFormValues());
      setErrorMessage(null);
    }
  }, [visible, initialEvent]);

  const headerTitle = useMemo(
    () => (mode === "edit" ? "Editar evento" : "Criar novo evento"),
    [mode]
  );

  const primaryActionLabel = useMemo(
    () => (mode === "edit" ? "Salvar alterações" : "Criar evento"),
    [mode]
  );

  const toggleGenre = (genre: EventGenre) => {
    setFormValues((prev) => {
      const exists = prev.genres.includes(genre);
      return {
        ...prev,
        genres: exists ? prev.genres.filter((item) => item !== genre) : [...prev.genres, genre],
      };
    });
  };

  // Handler para selecionar localização no mapa
  const handleLocationSelected = (location: { latitude: number; longitude: number }) => {
    setFormValues((prev) => ({
      ...prev,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    }));
  };

  // Handlers para os date pickers
  const openStartDatePicker = () => {
    if (Platform.OS === "android") {
      const currentDate = formValues.startsAt ? new Date(formValues.startsAt) : new Date();
      DateTimePickerAndroid.open({
        value: currentDate,
        mode: "date",
        onChange: (_event, date) => {
          if (date) {
            // Após selecionar a data, abre o time picker
            DateTimePickerAndroid.open({
              value: date,
              mode: "time",
              onChange: (_timeEvent, time) => {
                if (time) {
                  setFormValues((prev) => ({
                    ...prev,
                    startsAt: time.toISOString(),
                  }));
                }
              },
            });
          }
        },
      });
    } else {
      // iOS usa o modal tradicional
      setShowStartDatePicker(true);
    }
  };

  const openEndDatePicker = () => {
    if (Platform.OS === "android") {
      const currentDate = formValues.endsAt ? new Date(formValues.endsAt) : new Date();
      DateTimePickerAndroid.open({
        value: currentDate,
        mode: "date",
        onChange: (_event, date) => {
          if (date) {
            // Após selecionar a data, abre o time picker
            DateTimePickerAndroid.open({
              value: date,
              mode: "time",
              onChange: (_timeEvent, time) => {
                if (time) {
                  setFormValues((prev) => ({
                    ...prev,
                    endsAt: time.toISOString(),
                  }));
                }
              },
            });
          }
        },
      });
    } else {
      // iOS usa o modal tradicional
      setShowEndDatePicker(true);
    }
  };

  // Handler para iOS
  const handleIOSDateChange = (type: "start" | "end") => (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (type === "start") {
        setTempStartDate(selectedDate);
        setFormValues((prev) => ({
          ...prev,
          startsAt: selectedDate.toISOString(),
        }));
      } else {
        setTempEndDate(selectedDate);
        setFormValues((prev) => ({
          ...prev,
          endsAt: selectedDate.toISOString(),
        }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!formValues.title.trim()) {
      setErrorMessage("Informe o título do evento.");
      return;
    }
    if (!formValues.genres.length) {
      setErrorMessage("Selecione pelo menos um gênero musical.");
      return;
    }
    if (!formValues.locationName.trim()) {
      setErrorMessage("Informe o local do evento.");
      return;
    }
    if (!formValues.city.trim()) {
      setErrorMessage("Informe a cidade do evento.");
      return;
    }
    if (!formValues.latitude.trim() || !formValues.longitude.trim()) {
      setErrorMessage("Informe latitude e longitude para posicionar o mapa.");
      return;
    }
    if (!formValues.startsAt.trim()) {
      setErrorMessage("Informe a data e horário de início.");
      return;
    }

    setErrorMessage(null);
    await onSubmit(formValues);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>{headerTitle}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}
          >Campos marcados com * são obrigatórios.</Text>

          <View style={styles.scrollWrapper}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
            <Field label="Título *" value={formValues.title} onChangeText={(text) => setFormValues((prev) => ({ ...prev, title: text }))} />

            <Field
              label="Descrição"
              multiline
              numberOfLines={4}
              value={formValues.description}
              onChangeText={(text) => setFormValues((prev) => ({ ...prev, description: text }))}
              style={{ height: 120, textAlignVertical: "top" }}
            />

            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Tipo de evento</Text>
            <View style={styles.chipsRow}>
              {EVENT_TYPES.map((type) => {
                const selected = formValues.eventType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? theme.colors.primary : "transparent",
                        borderColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setFormValues((prev) => ({ ...prev, eventType: type.value }))}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: selected ? "#FFFFFF" : theme.colors.primary },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Gêneros *</Text>
            <View style={styles.chipsWrap}>
              {EVENT_GENRES.map((genre) => {
                const selected = formValues.genres.includes(genre.value);
                return (
                  <TouchableOpacity
                    key={genre.value}
                    style={[
                      styles.genreChip,
                      {
                        backgroundColor: selected ? genre.color : "transparent",
                        borderColor: genre.color,
                      },
                    ]}
                    onPress={() => toggleGenre(genre.value)}
                  >
                    <Text
                      style={[
                        styles.genreChipText,
                        { color: selected ? "#FFFFFF" : genre.color },
                      ]}
                    >
                      {genre.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Field
              label="Local *"
              value={formValues.locationName}
              onChangeText={(text) => setFormValues((prev) => ({ ...prev, locationName: text }))}
            />

            <Field
              label="Endereço"
              value={formValues.address}
              onChangeText={(text) => setFormValues((prev) => ({ ...prev, address: text }))}
            />

            <View style={styles.inlineRow}>
              <View style={{ flex: 1 }}>
                <Field
                  label="Cidade *"
                  value={formValues.city}
                  onChangeText={(text) => setFormValues((prev) => ({ ...prev, city: text }))}
                />
              </View>
              <View style={{ width: 90 }}>
                <Field
                  label="UF"
                  value={formValues.state}
                  autoCapitalize="characters"
                  maxLength={2}
                  onChangeText={(text) => setFormValues((prev) => ({ ...prev, state: text }))}
                />
              </View>
            </View>

            <Field
              label="País"
              value={formValues.country}
              onChangeText={(text) => setFormValues((prev) => ({ ...prev, country: text }))}
            />

            <View style={styles.locationSection}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                Localização no Mapa *
              </Text>
              <TouchableOpacity
                style={[styles.locationButton, { borderColor: theme.colors.primary }]}
                onPress={() => setShowLocationPicker(true)}
              >
                <Ionicons name="location" size={20} color={theme.colors.primary} />
                <Text style={[styles.locationButtonText, { color: theme.colors.text }]}>
                  {formValues.latitude && formValues.longitude
                    ? `${parseFloat(formValues.latitude).toFixed(4)}, ${parseFloat(formValues.longitude).toFixed(4)}`
                    : "Selecionar no mapa"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 16 }} />

            <View style={styles.inlineRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Field
                  label="Latitude (auto)"
                  keyboardType="numeric"
                  editable={false}
                  value={formValues.latitude}
                  onChangeText={(text) => setFormValues((prev) => ({ ...prev, latitude: text }))}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Field
                  label="Longitude (auto)"
                  keyboardType="numeric"
                  editable={false}
                  value={formValues.longitude}
                  onChangeText={(text) => setFormValues((prev) => ({ ...prev, longitude: text }))}
                />
              </View>
            </View>

            <View style={styles.dateSection}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                Data e Horário de Início *
              </Text>
              <TouchableOpacity
                style={[styles.dateButton, { borderColor: theme.colors.primary }]}
                onPress={openStartDatePicker}
              >
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                  {formValues.startsAt ? formatBrazilianDate(formValues.startsAt) : "Selecionar data"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateSection}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                Data e Horário de Término
              </Text>
              <TouchableOpacity
                style={[styles.dateButton, { borderColor: theme.colors.primary }]}
                onPress={openEndDatePicker}
              >
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                  {formValues.endsAt ? formatBrazilianDate(formValues.endsAt) : "Selecionar data"}
                </Text>
              </TouchableOpacity>
            </View>

            <Field
              label="Link de ingressos"
              placeholder="https://"
              value={formValues.ticketsUrl}
              onChangeText={(text) => setFormValues((prev) => ({ ...prev, ticketsUrl: text }))}
            />

            <Field
              label="Contato do organizador"
              placeholder="ex: email ou @social"
              value={formValues.promoterContact}
              onChangeText={(text) =>
                setFormValues((prev) => ({ ...prev, promoterContact: text }))
              }
            />

            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Evento público</Text>
              <Switch
                value={formValues.isPublic}
                onValueChange={(value) => setFormValues((prev) => ({ ...prev, isPublic: value }))}
                trackColor={{ false: "#ccc", true: theme.colors.primary }}
                thumbColor={formValues.isPublic ? "#FFFFFF" : "#f4f3f4"}
              />
            </View>

            {errorMessage ? (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>
            ) : null}
          </ScrollView>
          </View>

          <View style={styles.actions}>
            <CustomButton
              title="Cancelar"
              onPress={onClose}
              backgroundColor={theme.colors.card}
              textColor={theme.colors.primary}
              style={styles.actionButton}
            />
            <CustomButton
              title={primaryActionLabel}
              onPress={handleSubmit}
              disabled={isSubmitting}
              backgroundColor={theme.colors.primary}
              textColor="#FFFFFF"
              style={styles.actionButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Modal de seleção de localização */}
      <LocationPickerModal
        visible={showLocationPicker}
        initialLocation={
          formValues.latitude && formValues.longitude
            ? {
                latitude: parseFloat(formValues.latitude),
                longitude: parseFloat(formValues.longitude),
              }
            : undefined
        }
        onLocationSelected={handleLocationSelected}
        onClose={() => setShowLocationPicker(false)}
      />

      {/* Date Picker para iOS - data de início */}
      {showStartDatePicker && Platform.OS === "ios" && (
        <Modal visible={showStartDatePicker} transparent animationType="slide">
          <View style={styles.datePickerModal}>
            <View style={[styles.datePickerContainer, { backgroundColor: theme.colors.card }]}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                  <Text style={[styles.datePickerButton, { color: theme.colors.primary }]}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempStartDate}
                mode="datetime"
                display="spinner"
                onChange={handleIOSDateChange("start")}
                locale="pt-BR"
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker para iOS - data de término */}
      {showEndDatePicker && Platform.OS === "ios" && (
        <Modal visible={showEndDatePicker} transparent animationType="slide">
          <View style={styles.datePickerModal}>
            <View style={[styles.datePickerContainer, { backgroundColor: theme.colors.card }]}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                  <Text style={[styles.datePickerButton, { color: theme.colors.primary }]}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempEndDate}
                mode="datetime"
                display="spinner"
                onChange={handleIOSDateChange("end")}
                locale="pt-BR"
              />
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}

function getDefaultFormValues(): EventFormValues {
  const now = new Date();
  // Ajusta para fuso horário local
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const iso = localDate.toISOString().replace("T", " ").slice(0, 16);
  return {
    ...EMPTY_VALUES,
    startsAt: iso,
    latitude: "-23.5505",  // São Paulo como padrão
    longitude: "-46.6333",
  };
}

function mapEventToForm(event: ShowEvent): EventFormValues {
  return {
    title: event.title,
    description: event.description ?? "",
    eventType: event.eventType,
    genres: event.genres.length ? event.genres : ["general"],
    locationName: event.locationName,
    address: event.address ?? "",
    city: event.city,
    state: event.state ?? "",
    country: event.country ?? "Brasil",
    latitude: String(event.latitude),
    longitude: String(event.longitude),
    startsAt: formatDateForInput(event.startsAt),
    endsAt: event.endsAt ? formatDateForInput(event.endsAt) : "",
    ticketsUrl: event.ticketsUrl ?? "",
    promoterContact: event.promoterContact ?? "",
    isPublic: event.isPublic,
  };
}

function formatDateForInput(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  // Ajusta para fuso horário local
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().replace("T", " ").slice(0, 16);
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: StyleProp<TextStyle>;
  maxLength?: number;
  editable?: boolean;
};

function Field({ label, style, editable = true, ...props }: FieldProps) {
  const theme = useTheme();
  return (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.fieldLabel, { color: theme.colors.muted }]}>{label}</Text>
      <TextInput
        {...props}
        editable={editable}
        style={[
          styles.input,
          { borderColor: theme.colors.box, color: theme.colors.text },
          !editable && { backgroundColor: theme.colors.box, opacity: 0.6 },
          style,
        ]}
        placeholderTextColor="#9AA0B4"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  container: {
    borderRadius: 16,
    padding: 20,
    height: "95%",
    elevation: 8,
  },
  headerTitle: {
    fontFamily: "SansationBold",
    fontSize: 22,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Sansation",
    fontSize: 13,
    marginBottom: 16,
  },
  scrollWrapper: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: "Sansation",
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: "Sansation",
    fontSize: 15,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontFamily: "SansationBold",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: {
    fontFamily: "SansationBold",
    fontSize: 12,
    textTransform: "uppercase",
  },
  genreChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  genreChipText: {
    fontFamily: "Sansation",
    fontSize: 13,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
  },
  toggleLabel: {
    fontFamily: "Sansation",
    fontSize: 15,
  },
  errorText: {
    fontFamily: "SansationBold",
    fontSize: 13,
    marginTop: 8,
  },
  locationSection: {
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1.5,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },
  locationButtonText: {
    fontFamily: "Sansation",
    fontSize: 14,
    flex: 1,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1.5,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },
  dateButtonText: {
    fontFamily: "Sansation",
    fontSize: 14,
    flex: 1,
  },
  datePickerModal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  datePickerButton: {
    fontFamily: "SansationBold",
    fontSize: 16,
    padding: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
  },
});
