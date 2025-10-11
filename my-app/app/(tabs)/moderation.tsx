/*
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { useReports } from "@/context/ReportsContext";
import { getStatusLabel } from "@/utils/reports";
import type { Report, ReportStatus } from "@/types/reports";

const FILTERS: Array<{ key: ReportStatus | "all"; label: string }> = [
  { key: "all", label: "Todas" },
  { key: "open", label: "Abertas" },
  { key: "in_review", label: "Em análise" },
  { key: "resolved", label: "Resolvidas" },
  { key: "dismissed", label: "Descartadas" },
];

const STATUS_TRANSITIONS: Partial<Record<ReportStatus, ReportStatus[]>> = {
  open: ["in_review", "resolved", "dismissed"],
  in_review: ["resolved", "dismissed", "open"],
  resolved: ["open", "dismissed"],
  dismissed: ["open"],
};

export default function ModerationScreen() {
  const theme = useTheme();
  const { reports, totalsByStatus, isLoading, refresh, changeStatus, lastError } = useReports();
  const [selectedFilter, setSelectedFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredReports = useMemo(() => {
    if (selectedFilter === "all") {
      return reports;
    }
    return reports.filter((report) => report.status === selectedFilter);
  }, [reports, selectedFilter]);

  const onRefresh = async () => {
    try {
      await refresh();
    } catch (error) {
      if (__DEV__) {
        console.warn("[Moderation] Falha ao atualizar lista:", error);
      }
    }
  };

  const handleChangeStatus = async (report: Report, status: ReportStatus) => {
    setUpdatingId(report.id);
    try {
      await changeStatus({ id: report.id, status });
    } catch (error) {
      if (__DEV__) {
        console.warn("[Moderation] Erro ao atualizar denúncia:", error);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Central de Moderação</Text>
        <TouchableOpacity onPress={onRefresh} disabled={isLoading} style={styles.refreshButton}>
          <Ionicons
            name="refresh"
            size={20}
            color={isLoading ? theme.colors.muted : theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>Gerencie denúncias enviadas pelos usuários.</Text>

      <View style={styles.filtersRow}>
        {FILTERS.map((filter) => {
          const isActive = selectedFilter === filter.key;
          return (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              style={[
                styles.filterPill,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.background,
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              <Text
                style={{
                  color: isActive ? theme.colors.background : theme.colors.primary,
                  fontWeight: "600",
                }}
              >
                {filter.label}
              </Text>
              {filter.key !== "all" && (
                <View style={[styles.badge, { backgroundColor: theme.colors.primary + "22" }]}> 
                  <Text style={{ color: theme.colors.primary, fontSize: 12 }}>
                    {totalsByStatus[filter.key as ReportStatus] ?? 0}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {lastError && (
        <View style={[styles.errorBox, { borderColor: theme.colors.primary + "55" }]}> 
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <Text style={{ color: theme.colors.primary, flex: 1 }}>{lastError}</Text>
        </View>
      )}

      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportListItem
            report={item}
            onChangeStatus={handleChangeStatus}
            updating={updatingId === item.id}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 160 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark" size={48} color={theme.colors.muted} />
            <Text style={{ color: theme.colors.muted, marginTop: 8 }}>Nenhuma denúncia para o filtro selecionado.</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      />
    </SafeAreaView>
  );
}

type ReportListItemProps = {
  report: Report;
  updating: boolean;
  onChangeStatus: (report: Report, status: ReportStatus) => Promise<void>;
};

function ReportListItem({ report, updating, onChangeStatus }: ReportListItemProps) {
  const theme = useTheme();
  const possibleStatuses = STATUS_TRANSITIONS[report.status] ?? [];

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
      <View style={styles.cardHeader}>
        <Ionicons name="alert-circle" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>{report.reason}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
            {new Date(report.createdAt).toLocaleString("pt-BR")}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary + "15" }]}> 
          <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: "700" }}>
            {getStatusLabel(report.status)}
          </Text>
        </View>
      </View>

      <Text style={{ color: theme.colors.text, marginTop: 8, fontWeight: "600" }}>Alvo</Text>
      <Text style={{ color: theme.colors.text }}>{report.targetLabel}</Text>

      <Text style={{ color: theme.colors.text, marginTop: 8, fontWeight: "600" }}>Descrição</Text>
      <Text style={{ color: theme.colors.text }}>{report.description ?? "Sem detalhes adicionais."}</Text>

      <Text style={{ color: theme.colors.muted, marginTop: 8, fontSize: 12 }}>
        Denunciado por {report.reporterName}
      </Text>

      {report.resolutionNotes && (
        <View style={[styles.resolutionBox, { borderColor: theme.colors.primary + "33" }]}> 
          <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>Notas</Text>
          <Text style={{ color: theme.colors.text, marginTop: 4 }}>{report.resolutionNotes}</Text>
        </View>
      )}

      <View style={styles.actionsRow}>
        {possibleStatuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.actionButton,
              {
                borderColor: theme.colors.primary + "55",
                backgroundColor: theme.colors.background,
              },
            ]}
            disabled={updating}
            onPress={() => onChangeStatus(report, status)}
          >
            {updating ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                {getStatusLabel(status)}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  refreshButton: {
    padding: 8,
  },
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  resolutionBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 110,
  },
});
*/

export default function ModerationScreen() {
  return null;
}
