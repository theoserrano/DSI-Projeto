import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { REPORT_REASONS } from "@/constants/reports";
import type { CreateReportPayload, ReportTargetType } from "@/types/reports";
import { useTheme } from "@/context/ThemeContext";
import { CustomButton } from "@/components/ui/CustomButton";

export type ReportModalTarget = {
  targetId: string;
  targetLabel: string;
  targetType: ReportTargetType;
};

export type ReportModalReporter = {
  id: string;
  name: string;
};

type ReportModalProps = {
  visible: boolean;
  onClose: () => void;
  target: ReportModalTarget | null;
  reporter: ReportModalReporter | null;
  onSubmit: (payload: CreateReportPayload) => Promise<void> | void;
  isSubmitting?: boolean;
};

const DEFAULT_REASON = REPORT_REASONS[0];

export function ReportModal({
  visible,
  onClose,
  target,
  reporter,
  onSubmit,
  isSubmitting = false,
}: ReportModalProps) {
  const theme = useTheme();
  const [reason, setReason] = useState<string>(DEFAULT_REASON);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (!visible) {
      setReason(DEFAULT_REASON);
      setDescription("");
    }
  }, [visible]);

  const isReadyToSubmit = useMemo(() => {
    return Boolean(target && reporter && reason);
  }, [target, reporter, reason]);

  const handleSubmit = async () => {
    if (!target || !reporter) {
      return;
    }

    await Promise.resolve(
      onSubmit({
      reporterId: reporter.id,
      reporterName: reporter.name,
      targetId: target.targetId,
      targetLabel: target.targetLabel,
      targetType: target.targetType,
      reason,
      description: description.trim() ? description.trim() : undefined,
      })
    );
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}> 
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>Denunciar conteúdo</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {target && (
            <View style={[styles.targetCard, { borderColor: theme.colors.primary + "55" }]}> 
              <Ionicons name="warning-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.targetLabel, { color: theme.colors.primary }]}>{target.targetLabel}</Text>
                <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
                  Tipo: {translateTargetType(target.targetType)}
                </Text>
              </View>
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Qual o motivo?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 6 }}
            style={{ marginBottom: 12 }}
          >
            {REPORT_REASONS.map((item) => {
              const isActive = reason === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.reasonPill,
                    {
                      backgroundColor: isActive ? theme.colors.primary : theme.colors.background,
                      borderColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => setReason(item)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={{
                      color: isActive ? theme.colors.background : theme.colors.primary,
                      fontWeight: "600",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Conte mais detalhes</Text>
          <View style={[styles.textAreaWrapper, { borderColor: theme.colors.primary + "55" }]}> 
            <TextInput
              style={[styles.textArea, { color: theme.colors.text }]}
              placeholder="Descreva o que aconteceu"
              placeholderTextColor={theme.colors.muted}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              maxLength={500}
            />
            <Text style={[styles.counter, { color: theme.colors.muted }]}>{description.length}/500</Text>
          </View>

          <CustomButton
            title={isSubmitting ? "Enviando..." : "Enviar denúncia"}
            onPress={handleSubmit}
            disabled={!isReadyToSubmit || isSubmitting}
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    </Modal>
  );
}

function translateTargetType(type: ReportTargetType): string {
  switch (type) {
    case "review":
      return "Review";
    case "user":
      return "Usuário";
    case "comment":
      return "Comentário";
    case "event":
      return "Evento";
    default:
      return type;
  }
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
  targetCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  reasonPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
  },
  textArea: {
    flex: 1,
    minHeight: 80,
    textAlignVertical: "top",
  },
  counter: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 6,
  },
});
