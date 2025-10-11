import type { CreateReportPayload, Report } from "@/types/reports";

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
