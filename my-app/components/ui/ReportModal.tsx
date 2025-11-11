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
        <View style={[styles.drawerContainer, { backgroundColor: theme.colors.card }]}>
          {/* Handle bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
              Denunciar conteúdo
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {target && (
              <View style={[styles.targetCard, { 
                borderColor: theme.colors.primary + "55",
                backgroundColor: theme.colors.primary + "0F"
              }]}> 
                <Ionicons name="warning-outline" size={24} color={theme.colors.primary} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.targetLabel, { color: theme.colors.primary }]}>
                    {target.targetLabel}
                  </Text>
                  <Text style={{ color: theme.colors.muted, fontSize: 13, marginTop: 2 }}>
                    Tipo: {translateTargetType(target.targetType)}
                  </Text>
                </View>
              </View>
            )}

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Qual o motivo?
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
              style={{ marginBottom: 16 }}
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
                        fontSize: 14,
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Conte mais detalhes
            </Text>
            <View style={[styles.textAreaWrapper, { borderColor: theme.colors.primary + "55" }]}> 
              <TextInput
                style={[styles.textArea, { color: theme.colors.text }]}
                placeholder="Descreva o que aconteceu (opcional)"
                placeholderTextColor={theme.colors.muted}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                maxLength={500}
              />
              <Text style={[styles.counter, { color: theme.colors.muted }]}>
                {description.length}/500
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={[styles.actionsContainer, { borderTopColor: theme.colors.border }]}>
            <CustomButton
              title={isSubmitting ? "Enviando..." : "Enviar denúncia"}
              onPress={handleSubmit}
              disabled={!isReadyToSubmit || isSubmitting}
            />
          </View>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  drawerContainer: {
    height: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  targetCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  targetLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  reasonPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 10,
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
  },
  textArea: {
    flex: 1,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 15,
  },
  counter: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
});
