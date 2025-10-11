import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { CustomButton } from "@/components/ui/CustomButton";
import type { Report, ReportStatus, UpdateReportStatusPayload } from "@/types/reports";
import { getStatusLabel } from "@/utils/reports";

const STATUS_OPTIONS: ReportStatus[] = ["open", "in_review", "resolved", "dismissed"];

type ReportDetailsModalProps = {
  visible: boolean;
  report: Report | null;
  onClose: () => void;
  onSubmit: (payload: UpdateReportStatusPayload) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function ReportDetailsModal({
  visible,
  report,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ReportDetailsModalProps) {
  const theme = useTheme();
  const [status, setStatus] = useState<ReportStatus>("open");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (report) {
      setStatus(report.status);
      setNotes(report.resolutionNotes ?? "");
    } else {
      setStatus("open");
      setNotes("");
    }
  }, [report, visible]);

  const statusLabel = useMemo(() => getStatusLabel(status), [status]);

  const handleSubmit = async () => {
    if (!report) {
      return;
    }

    await Promise.resolve(
      onSubmit({
        id: report.id,
        status,
        resolutionNotes: notes.trim() ? notes.trim() : undefined,
      })
    );
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}> 
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>Detalhes da denúncia</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {report && (
            <View style={{ gap: 8 }}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Motivo</Text>
              <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>{report.reason}</Text>

              <Text style={[styles.label, { color: theme.colors.text, marginTop: 12 }]}>Conteúdo</Text>
              <Text style={{ color: theme.colors.text }}>{report.targetLabel}</Text>
              {report.description ? (
                <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{report.description}</Text>
              ) : null}

              <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Status</Text>
              <View style={styles.statusRow}>
                {STATUS_OPTIONS.map((option) => {
                  const active = option === status;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setStatus(option)}
                      style={[
                        styles.statusChip,
                        {
                          backgroundColor: active ? theme.colors.primary : theme.colors.background,
                          borderColor: theme.colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: active ? theme.colors.background : theme.colors.primary,
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        {getStatusLabel(option)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Anotações</Text>
              <View style={[styles.notesBox, { borderColor: theme.colors.primary + "55" }]}> 
                <TextInput
                  style={[styles.notesInput, { color: theme.colors.text }]}
                  placeholder={`Observações (${statusLabel.toLowerCase()})`}
                  placeholderTextColor={theme.colors.muted}
                  multiline
                  numberOfLines={4}
                  value={notes}
                  onChangeText={setNotes}
                  maxLength={500}
                />
                <Text style={{ color: theme.colors.muted, fontSize: 12, textAlign: "right" }}>{notes.length}/500</Text>
              </View>

              <CustomButton
                title={isSubmitting ? "Salvando..." : "Salvar alterações"}
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={{ marginTop: 16 }}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxHeight: "90%",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  notesBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    gap: 8,
  },
  notesInput: {
    flex: 1,
    minHeight: 80,
    textAlignVertical: "top",
  },
});
