import { REPORTS_SEED } from "@/constants/reports";
import type {
  CreateReportPayload,
  Report,
  ReportStatus,
  UpdateReportStatusPayload,
} from "@/types/reports";
const REPORT_ID_PREFIX = "rpt";

export function generateReportId(): string {
  const randomHex = Math.random().toString(16).slice(2, 8);
  return `${REPORT_ID_PREFIX}-${randomHex}`;
}

export function createReportFromPayload(payload: CreateReportPayload): Report {
  const now = new Date().toISOString();

  return {
    id: generateReportId(),
    reporterId: payload.reporterId,
    reporterName: payload.reporterName,
    targetType: payload.targetType,
    targetId: payload.targetId,
    targetLabel: payload.targetLabel,
    reason: payload.reason,
    description: payload.description,
    status: "open",
    createdAt: now,
    updatedAt: now,
  };
}

export function applyReportStatusUpdate(
  current: Report,
  input: UpdateReportStatusPayload
): Report {
  const resolutionNotes =
    input.status === "resolved" || input.status === "dismissed"
      ? input.resolutionNotes ?? current.resolutionNotes ?? null
      : null;

  return {
    ...current,
    status: input.status,
    resolutionNotes,
    updatedAt: new Date().toISOString(),
  };
}

export function sortReportsByDate(reports: Report[]): Report[] {
  return [...reports].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getReportsSeed(): Report[] {
  return sortReportsByDate(REPORTS_SEED);
}

export function parseReport(data: unknown): Report | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Partial<Report>;
  if (
    !record.id ||
    !record.reporterId ||
    !record.reporterName ||
    !record.targetId ||
    !record.targetType ||
    !record.targetLabel ||
    !record.reason ||
    !record.status ||
    !record.createdAt
  ) {
    return null;
  }

  return {
    id: record.id,
    reporterId: record.reporterId,
    reporterName: record.reporterName,
    targetId: record.targetId,
    targetType: record.targetType,
    targetLabel: record.targetLabel,
    reason: record.reason,
    description: record.description,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? null,
    resolutionNotes: record.resolutionNotes ?? null,
  };
}

export function parseReports(data: unknown): Report[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return sortReportsByDate(
    data
      .map(parseReport)
      .filter((item): item is Report => Boolean(item))
  );
}

export function getStatusLabel(status: ReportStatus): string {
  switch (status) {
    case "open":
      return "Aberta";
    case "in_review":
      return "Em análise";
    case "resolved":
      return "Resolvida";
    case "dismissed":
      return "Descartada";
    default:
      return status;
  }
}
